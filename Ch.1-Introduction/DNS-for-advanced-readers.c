#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <unistd.h>

// DNS header structure
struct DNS_HEADER {
    unsigned short id;       // Identification number

    unsigned char rd :1;     // Recursion Desired
    unsigned char tc :1;     // Truncated Message
    unsigned char aa :1;     // Authoritative Answer
    unsigned char opcode :4; // Purpose of message
    unsigned char qr :1;     // Query/Response Flag

    unsigned char rcode :4;  // Response Code
    unsigned char cd :1;     // Checking Disabled
    unsigned char ad :1;     // Authenticated Data
    unsigned char z :1;      // Reserved
    unsigned char ra :1;     // Recursion Available

    unsigned short q_count;  // Number of questions
    unsigned short ans_count; // Number of answers
    unsigned short auth_count; // Number of authority records
    unsigned short add_count;  // Number of additional records
};

// Question structure for DNS query
struct QUESTION {
    unsigned short qtype;
    unsigned short qclass;
};

// Function to convert domain name to DNS query format (e.g., "example.com" -> "7example3com")
void format_domain(unsigned char* dns, unsigned char* host) {
    int lock = 0, i;
    strcat((char*)host, ".");
    
    for (i = 0; i < strlen((char*)host); i++) {
        if (host[i] == '.') {
            *dns++ = i - lock;
            for (; lock < i; lock++) {
                *dns++ = host[lock];
            }
            lock++;
        }
    }
    *dns++ = '\0';
}

// Main DNS query function
void raw_dns_query(char *host) {
    unsigned char buf[65536], *qname;
    int sockfd;
    struct sockaddr_in dest;

    struct DNS_HEADER *dns = NULL;
    struct QUESTION *qinfo = NULL;

    // Create UDP socket
    sockfd = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP); // UDP socket for DNS query
    if (sockfd < 0) {
        perror("Socket creation failed");
        exit(EXIT_FAILURE);
    }

    // DNS server details (Google's public DNS server 8.8.8.8)
    dest.sin_family = AF_INET;
    dest.sin_port = htons(53); // DNS uses port 53
    inet_pton(AF_INET, "8.8.8.8", &(dest.sin_addr));

    // Build DNS query packet
    dns = (struct DNS_HEADER *)&buf;
    dns->id = (unsigned short) htons(getpid()); // Identification number
    dns->qr = 0;  // This is a query
    dns->opcode = 0; // Standard query
    dns->aa = 0; // Not Authoritative
    dns->tc = 0; // Not Truncated
    dns->rd = 1; // Recursion Desired
    dns->ra = 0; // Recursion not available
    dns->z = 0;  // Reserved
    dns->ad = 0;
    dns->cd = 0;
    dns->rcode = 0;
    dns->q_count = htons(1); // We have one question
    dns->ans_count = 0;
    dns->auth_count = 0;
    dns->add_count = 0;

    // Set question name and type (A record query)
    qname = (unsigned char*)&buf[sizeof(struct DNS_HEADER)];
    format_domain(qname, (unsigned char*)host);

    // Set query info (A record for IPv4)
    qinfo = (struct QUESTION*)&buf[sizeof(struct DNS_HEADER) + strlen((const char*)qname) + 1];
    qinfo->qtype = htons(1); // Type A (IPv4)
    qinfo->qclass = htons(1); // Internet class

    // Send DNS query to the server
    if (sendto(sockfd, buf, sizeof(struct DNS_HEADER) + (strlen((const char*)qname) + 1) + sizeof(struct QUESTION),
               0, (struct sockaddr*)&dest, sizeof(dest)) < 0) {
        perror("Sendto failed");
    } else {
        printf("DNS Query Sent for %s\n", host);
    }

    // Receive DNS response
    int i = sizeof dest;
    if (recvfrom(sockfd, buf, 65536, 0, (struct sockaddr*)&dest, (socklen_t*)&i) < 0) {
        perror("Recvfrom failed");
    } else {
        printf("DNS Response Received\n");
        // Here, you would parse the response packet (e.g., extract answer records).
    }

    // Close the socket
    close(sockfd);
}

int main() {
    char domain[] = "example.com";
    raw_dns_query(domain);
    return 0;
}
