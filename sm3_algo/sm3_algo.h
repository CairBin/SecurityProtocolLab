#ifndef SM3_ALGO_H_
#define SM3_ALGO_H_

#include <stdlib.h>
#include <stdio.h>
#include <string.h>

#define P_0(x) (x^rotate_left(x,9)^(rotate_left(x,17)))
#define P_1(x) (x ^ rotate_left(x, 15) ^ (rotate_left(x, 23)))

/******
    if(j>=0 && j<16)
        return x^y^z;
    else if(16<=j && j<64)
        return (x&y) | (x&z) | (y&z);
    else
        return 0;
*******/
#define FF(x,y,z,j) ((j>=0 && j<16)?(x^y^z):((j>=16&&j<64)?((x&y)|(x&z)|(y&z)):0))

/*
    if (0 <= j && j < 16)
        return x ^ y ^ z;
    else if (16 <= j && j < 64)
        return (x&y) | ((~x) & z);
    else
        return 0;
*/
#define GG(x, y, z, j) ((j >= 0 && j < 16) ? (x ^ y ^ z) : (j >= 16 && j < 64 ? ((x & y) | ((~x) & z)) : 0))

static unsigned int T[64];
static unsigned int hash[8];
static unsigned char message_buffer[64]; //used for block

/// @brief initialize sm3
void
sm3_init(){
    int i = 0;
    for (i = 0; i < 16; i++)
        T[i] = 0x79cc4519;
    for (i = 16; i < 64; i++)
        T[i] = 0x7a879d8a;

    // iv
    hash[0] = 0x7380166f;
    hash[1] = 0x4914b2b9;
    hash[2] = 0x172442d7;
    hash[3] = 0xda8a0600;
    hash[4] = 0xa96f30bc;
    hash[5] = 0x163138aa;
    hash[6] = 0xe38dee4d;
    hash[7] = 0xb0fb0e4e;
}

/// @brief rotate left
/// @param a value
/// @param b rotate left bits number
/// @return  rotate left result
unsigned int
rotate_left(unsigned int a, unsigned int b){
    b%=32;
    return (
        ((a << b) & 0xFFFFFFFF) |
        ((a & 0xFFFFFFFF) >> (32 - b))
    );
}

void CF(unsigned char* arr){
    unsigned int W[68];
    unsigned int W_1[64];
    unsigned int j;
    unsigned int A, B, C, D, E, F, G, H;
    unsigned int SS1, SS2, TT1, TT2;
    for (j = 0; j < 16; j++)
        W[j] = arr[j * 4 + 0] << 24 | arr[j * 4 + 1] << 16 | arr[j * 4 + 2] << 8 | arr[j * 4 + 3];
    for (j = 16; j < 68; j++)
        W[j] = P_1(W[j - 16] ^ W[j - 9] ^ (rotate_left(W[j - 3], 15))) ^ (rotate_left(W[j - 13], 7)) ^ W[j - 6];
    for (j = 0; j < 64; j++)
        W_1[j] = W[j] ^ W[j + 4];
    A = hash[0];
    B = hash[1];
    C = hash[2];
    D = hash[3];
    E = hash[4];
    F = hash[5];
    G = hash[6];
    H = hash[7];
    for (j = 0; j < 64; j++)
    {
        SS1 = rotate_left(((rotate_left(A, 12)) + E + (rotate_left(T[j], j))) & 0xFFFFFFFF, 7);
        SS2 = SS1 ^ (rotate_left(A, 12));
        TT1 = (FF(A, B, C, j) + D + SS2 + W_1[j]) & 0xFFFFFFFF;
        TT2 = (GG(E, F, G, j) + H + SS1 + W[j]) & 0xFFFFFFFF;
        D = C;
        C = rotate_left(B, 9);
        B = A;
        A = TT1;
        H = G;
        G = rotate_left(F, 19);
        F = E;
        E = P_0(TT2);
    }

    hash[0] = (A ^ hash[0]);
    hash[1] = (B ^ hash[1]);
    hash[2] = (C ^ hash[2]);
    hash[3] = (D ^ hash[3]);
    hash[4] = (E ^ hash[4]);
    hash[5] = (F ^ hash[5]);
    hash[6] = (G ^ hash[6]);
    hash[7] = (H ^ hash[7]);
}

/// @brief block message
/// @param msg input message string
/// @param length the length of message
void block_message
(unsigned char *msg, unsigned int length){
    int i=0,left=0;
    unsigned long long total = 0;
    for(;i<length/64;i++){
        memcpy(message_buffer, msg+i*64,64);
        CF(message_buffer);
    }

    //filling
    total = length*8;
    left = length%64;
    memset(&message_buffer[left], 0, 64-left);
    memcpy(message_buffer, msg+i*64, left);
    message_buffer[left] = 0x80;

    // iteration and compression
    if(left<=55){
        for(i=0;i<8;i++)
            message_buffer[56+i]=
                (total>>((7-i)*8) ) & 0xFF;
        CF(message_buffer);
    }else{
        CF(message_buffer);
        memset(message_buffer, 0 ,64);
        for(i=0;i<8;i++)
            message_buffer[56 + i] =
                (total >> ((7 - i) * 8)) & 0xFF;
        CF(message_buffer);
    }

}

/// @brief sm3 hash function
/// @param msg input message
/// @param len  message length
/// @param out_hash output value(hex)
int sm3
(unsigned char* msg, unsigned len, unsigned char* out_val, unsigned int len_hash){
    
    if(len_hash<65){
        printf("error: the length of output array at least 65 bytes");
        return -1;
    }

    sm3_init();
    block_message(msg,len);

    // to hex string 
    unsigned char* res = out_val;
    for(int i=0;i<8;i++){
        sprintf(res, "%08X", hash[i]);
        res+=8;
    }

    return 1;
}


#endif