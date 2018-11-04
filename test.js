var analyze = require('Sentimental').analyze,
    positivity = require('Sentimental').positivity,
    negativity = require('Sentimental').negativity;

r = analyze("RNC chair declines to address racist campaign video - CNN Video"); //Score: -4, Comparative: -1
console.log(r);

r = analyze("GA Sec. of State's office launching investigation after alleged failed hacking attempt of voter registration system"); //Score: -4, Comparative: -1
console.log(r);

r = analyze("Abrams: Trump is 'wrong,' I am qualified to be Georgia's governor");
console.log(r);

r = analyze("Trump is trying to whip up fear about the browning of America");
console.log(r);

r = analyze("ABC journalist says Alec Baldwin once told her: ‘I hope you choke to death’");
console.log(r);