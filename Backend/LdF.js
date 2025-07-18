function LDF(word1,word2){
    const m=word1.length, n=word2.length;
    const dp=Array.from({length:m+1},()=>Array(n+1).fill(0));

    for (let i=0;i<=m;i++) dp[i][0]=i;
    for (let j=0;j<=n;j++) dp[0][j]=j;

    for (let i=1;i<=m;i++){
        for (let j=1;j<=n;j++){
            if (word1[i-1]===word2[j-1]){
                dp[i][j]=dp[i-1][j-1];
            }else{
                dp[i][j]=Math.min(
                    dp[i-1][j-1], // replace
                    dp[i-1][j],     // delete
                    dp[i][j-1]      // insert
                )+1;
            }
        }
    }
    const a1= dp[m][n];
    similarity= (1 - a1 / Math.max(m, n)) * 100;
    similarity = Math.round(similarity * 10) / 10;
    return similarity
};
module.exports=LDF
