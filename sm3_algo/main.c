#include "sm3_algo.h"

int main(){
    unsigned char hash[65];
    memset(hash, 0, sizeof(hash));

    unsigned char* msg = "hello, world";
    int len = strlen(msg);

    if(sm3(msg,len,hash,sizeof(hash))!= -1 ){
        printf("%s\n",hash);
    }
    
    return 0;
}