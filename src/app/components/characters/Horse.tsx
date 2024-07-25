import { memo } from 'react';

const Horse = memo((w: string, h: string) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={w}
    height={h}
    viewBox="0 0 700 700"
  >
    <path
      d="M0 0 C9.24 0 18.48 0 28 0 C28 4.62 28 9.24 28 14 C37.24 14 46.48 14 56 14 C56 18.62 56 23.24 56 28 C60.62 28 65.24 28 70 28 C70 32.62 70 37.24 70 42 C74.62 42 79.24 42 84 42 C84 55.86 84 69.72 84 84 C88.62 84 93.24 84 98 84 C98 102.48 98 120.96 98 140 C93.38 140 88.76 140 84 140 C84 149.24 84 158.48 84 168 C88.62 168 93.24 168 98 168 C98 191.1 98 214.2 98 238 C102.62 238 107.24 238 112 238 C112 256.48 112 274.96 112 294 C107.38 294 102.76 294 98 294 C98 330.96 98 367.92 98 406 C93.38 406 88.76 406 84 406 C84 415.24 84 424.48 84 434 C79.38 434 74.76 434 70 434 C70 443.24 70 452.48 70 462 C74.62 462 79.24 462 84 462 C84 466.62 84 471.24 84 476 C88.62 476 93.24 476 98 476 C98 485.24 98 494.48 98 504 C102.62 504 107.24 504 112 504 C112 508.62 112 513.24 112 518 C116.62 518 121.24 518 126 518 C126 522.62 126 527.24 126 532 C130.62 532 135.24 532 140 532 C140 541.24 140 550.48 140 560 C130.76 560 121.52 560 112 560 C112 564.62 112 569.24 112 574 C107.38 574 102.76 574 98 574 C98 578.62 98 583.24 98 588 C93.38 588 88.76 588 84 588 C84 583.38 84 578.76 84 574 C79.38 574 74.76 574 70 574 C70 578.62 70 583.24 70 588 C-36.26 588 -142.52 588 -252 588 C-252 583.38 -252 578.76 -252 574 C-261.24 574 -270.48 574 -280 574 C-280 569.38 -280 564.76 -280 560 C-275.38 560 -270.76 560 -266 560 C-266 550.76 -266 541.52 -266 532 C-261.38 532 -256.76 532 -252 532 C-252 522.76 -252 513.52 -252 504 C-247.38 504 -242.76 504 -238 504 C-238 499.38 -238 494.76 -238 490 C-233.38 490 -228.76 490 -224 490 C-224 485.38 -224 480.76 -224 476 C-228.62 476 -233.24 476 -238 476 C-238 466.76 -238 457.52 -238 448 C-242.62 448 -247.24 448 -252 448 C-252 438.76 -252 429.52 -252 420 C-256.62 420 -261.24 420 -266 420 C-266 406.14 -266 392.28 -266 378 C-270.62 378 -275.24 378 -280 378 C-280 350.28 -280 322.56 -280 294 C-284.62 294 -289.24 294 -294 294 C-294 215.46 -294 136.92 -294 56 C-289.38 56 -284.76 56 -280 56 C-280 51.38 -280 46.76 -280 42 C-270.76 42 -261.52 42 -252 42 C-252 37.38 -252 32.76 -252 28 C-238.14 28 -224.28 28 -210 28 C-210 32.62 -210 37.24 -210 42 C-200.76 42 -191.52 42 -182 42 C-182 51.24 -182 60.48 -182 70 C-177.38 70 -172.76 70 -168 70 C-168 74.62 -168 79.24 -168 84 C-163.38 84 -158.76 84 -154 84 C-154 97.86 -154 111.72 -154 126 C-121.66 126 -89.32 126 -56 126 C-56 102.9 -56 79.8 -56 56 C-51.38 56 -46.76 56 -42 56 C-42 46.76 -42 37.52 -42 28 C-37.38 28 -32.76 28 -28 28 C-28 23.38 -28 18.76 -28 14 C-18.76 14 -9.52 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#CD21FE"
      transform="translate(448,56)"
    />
    <path
      d="M0 0 C9.24 0 18.48 0 28 0 C28 4.62 28 9.24 28 14 C37.24 14 46.48 14 56 14 C56 18.62 56 23.24 56 28 C60.62 28 65.24 28 70 28 C70 32.62 70 37.24 70 42 C74.62 42 79.24 42 84 42 C84 55.86 84 69.72 84 84 C88.62 84 93.24 84 98 84 C98 102.48 98 120.96 98 140 C93.38 140 88.76 140 84 140 C84 149.24 84 158.48 84 168 C88.62 168 93.24 168 98 168 C98 191.1 98 214.2 98 238 C102.62 238 107.24 238 112 238 C112 256.48 112 274.96 112 294 C107.38 294 102.76 294 98 294 C98 330.96 98 367.92 98 406 C93.38 406 88.76 406 84 406 C84 415.24 84 424.48 84 434 C79.38 434 74.76 434 70 434 C70 443.24 70 452.48 70 462 C74.62 462 79.24 462 84 462 C84 466.62 84 471.24 84 476 C88.62 476 93.24 476 98 476 C98 485.24 98 494.48 98 504 C102.62 504 107.24 504 112 504 C112 508.62 112 513.24 112 518 C116.62 518 121.24 518 126 518 C126 522.62 126 527.24 126 532 C130.62 532 135.24 532 140 532 C140 541.24 140 550.48 140 560 C130.76 560 121.52 560 112 560 C112 564.62 112 569.24 112 574 C107.38 574 102.76 574 98 574 C98 578.62 98 583.24 98 588 C93.38 588 88.76 588 84 588 C84 583.38 84 578.76 84 574 C79.38 574 74.76 574 70 574 C70 578.62 70 583.24 70 588 C-36.26 588 -142.52 588 -252 588 C-252 583.38 -252 578.76 -252 574 C-261.24 574 -270.48 574 -280 574 C-280 569.38 -280 564.76 -280 560 C-275.38 560 -270.76 560 -266 560 C-266 550.76 -266 541.52 -266 532 C-261.38 532 -256.76 532 -252 532 C-252 522.76 -252 513.52 -252 504 C-247.38 504 -242.76 504 -238 504 C-238 499.38 -238 494.76 -238 490 C-233.38 490 -228.76 490 -224 490 C-224 485.38 -224 480.76 -224 476 C-228.62 476 -233.24 476 -238 476 C-238 466.76 -238 457.52 -238 448 C-242.62 448 -247.24 448 -252 448 C-252 438.76 -252 429.52 -252 420 C-256.62 420 -261.24 420 -266 420 C-266 406.14 -266 392.28 -266 378 C-270.62 378 -275.24 378 -280 378 C-280 350.28 -280 322.56 -280 294 C-284.62 294 -289.24 294 -294 294 C-294 215.46 -294 136.92 -294 56 C-289.38 56 -284.76 56 -280 56 C-280 51.38 -280 46.76 -280 42 C-270.76 42 -261.52 42 -252 42 C-252 37.38 -252 32.76 -252 28 C-238.14 28 -224.28 28 -210 28 C-210 32.62 -210 37.24 -210 42 C-200.76 42 -191.52 42 -182 42 C-182 51.24 -182 60.48 -182 70 C-177.38 70 -172.76 70 -168 70 C-168 74.62 -168 79.24 -168 84 C-163.38 84 -158.76 84 -154 84 C-154 97.86 -154 111.72 -154 126 C-121.66 126 -89.32 126 -56 126 C-56 102.9 -56 79.8 -56 56 C-51.38 56 -46.76 56 -42 56 C-42 46.76 -42 37.52 -42 28 C-37.38 28 -32.76 28 -28 28 C-28 23.38 -28 18.76 -28 14 C-18.76 14 -9.52 14 0 14 C0 9.38 0 4.76 0 0 Z M-14 28 C-14 37.24 -14 46.48 -14 56 C-18.62 56 -23.24 56 -28 56 C-28 69.86 -28 83.72 -28 98 C-32.62 98 -37.24 98 -42 98 C-42 111.86 -42 125.72 -42 140 C-37.38 140 -32.76 140 -28 140 C-28 144.62 -28 149.24 -28 154 C-69.58 154 -111.16 154 -154 154 C-154 158.62 -154 163.24 -154 168 C-158.62 168 -163.24 168 -168 168 C-168 158.76 -168 149.52 -168 140 C-172.62 140 -177.24 140 -182 140 C-182 126.14 -182 112.28 -182 98 C-186.62 98 -191.24 98 -196 98 C-196 88.76 -196 79.52 -196 70 C-200.62 70 -205.24 70 -210 70 C-210 65.38 -210 60.76 -210 56 C-223.86 56 -237.72 56 -252 56 C-252 60.62 -252 65.24 -252 70 C-256.62 70 -261.24 70 -266 70 C-266 157.78 -266 245.56 -266 336 C-261.38 336 -256.76 336 -252 336 C-252 354.48 -252 372.96 -252 392 C-247.38 392 -242.76 392 -238 392 C-238 401.24 -238 410.48 -238 420 C-233.38 420 -228.76 420 -224 420 C-224 429.24 -224 438.48 -224 448 C-219.38 448 -214.76 448 -210 448 C-210 457.24 -210 466.48 -210 476 C-205.38 476 -200.76 476 -196 476 C-196 480.62 -196 485.24 -196 490 C-191.38 490 -186.76 490 -182 490 C-182 494.62 -182 499.24 -182 504 C-177.38 504 -172.76 504 -168 504 C-168 508.62 -168 513.24 -168 518 C-158.76 518 -149.52 518 -140 518 C-140 522.62 -140 527.24 -140 532 C-130.76 532 -121.52 532 -112 532 C-112 536.62 -112 541.24 -112 546 C-84.28 546 -56.56 546 -28 546 C-28 541.38 -28 536.76 -28 532 C-18.76 532 -9.52 532 0 532 C0 527.38 0 522.76 0 518 C4.62 518 9.24 518 14 518 C14 508.76 14 499.52 14 490 C18.62 490 23.24 490 28 490 C28 485.38 28 480.76 28 476 C32.62 476 37.24 476 42 476 C42 466.76 42 457.52 42 448 C46.62 448 51.24 448 56 448 C56 438.76 56 429.52 56 420 C60.62 420 65.24 420 70 420 C70 392.28 70 364.56 70 336 C74.62 336 79.24 336 84 336 C84 294.42 84 252.84 84 210 C79.38 210 74.76 210 70 210 C70 200.76 70 191.52 70 182 C65.38 182 60.76 182 56 182 C56 172.76 56 163.52 56 154 C60.62 154 65.24 154 70 154 C70 130.9 70 107.8 70 84 C65.38 84 60.76 84 56 84 C56 70.14 56 56.28 56 42 C46.76 42 37.52 42 28 42 C28 37.38 28 32.76 28 28 C14.14 28 0.28 28 -14 28 Z "
      fill="#000000"
      transform="translate(448,56)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C18.62 14 23.24 14 28 14 C28 23.24 28 32.48 28 42 C32.62 42 37.24 42 42 42 C42 46.62 42 51.24 42 56 C46.62 56 51.24 56 56 56 C56 65.24 56 74.48 56 84 C51.38 84 46.76 84 42 84 C42 88.62 42 93.24 42 98 C37.38 98 32.76 98 28 98 C28 93.38 28 88.76 28 84 C23.38 84 18.76 84 14 84 C14 88.62 14 93.24 14 98 C-92.26 98 -198.52 98 -308 98 C-308 88.76 -308 79.52 -308 70 C-303.38 70 -298.76 70 -294 70 C-294 60.76 -294 51.52 -294 42 C-289.38 42 -284.76 42 -280 42 C-280 32.76 -280 23.52 -280 14 C-275.38 14 -270.76 14 -266 14 C-266 18.62 -266 23.24 -266 28 C-256.76 28 -247.52 28 -238 28 C-238 32.62 -238 37.24 -238 42 C-233.38 42 -228.76 42 -224 42 C-224 46.62 -224 51.24 -224 56 C-214.76 56 -205.52 56 -196 56 C-196 60.62 -196 65.24 -196 70 C-186.76 70 -177.52 70 -168 70 C-168 74.62 -168 79.24 -168 84 C-140.28 84 -112.56 84 -84 84 C-84 79.38 -84 74.76 -84 70 C-74.76 70 -65.52 70 -56 70 C-56 65.38 -56 60.76 -56 56 C-51.38 56 -46.76 56 -42 56 C-42 51.38 -42 46.76 -42 42 C-37.38 42 -32.76 42 -28 42 C-28 37.38 -28 32.76 -28 28 C-23.38 28 -18.76 28 -14 28 C-14 23.38 -14 18.76 -14 14 C-9.38 14 -4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#CD21FE"
      transform="translate(504,546)"
    />
    <path
      d="M0 0 C32.34 0 64.68 0 98 0 C98 4.62 98 9.24 98 14 C93.38 14 88.76 14 84 14 C84 27.86 84 41.72 84 56 C74.76 56 65.52 56 56 56 C56 46.76 56 37.52 56 28 C32.9 28 9.8 28 -14 28 C-14 23.38 -14 18.76 -14 14 C-9.38 14 -4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#000000"
      transform="translate(406,322)"
    />
    <path
      d="M0 0 C27.72 0 55.44 0 84 0 C84 4.62 84 9.24 84 14 C88.62 14 93.24 14 98 14 C98 27.86 98 41.72 98 56 C88.76 56 79.52 56 70 56 C70 46.76 70 37.52 70 28 C46.9 28 23.8 28 0 28 C0 18.76 0 9.52 0 0 Z "
      fill="#000000"
      transform="translate(224,322)"
    />
    <path
      d="M0 0 C13.86 0 27.72 0 42 0 C42 13.86 42 27.72 42 42 C28.14 42 14.28 42 0 42 C0 37.38 0 32.76 0 28 C-4.62 28 -9.24 28 -14 28 C-14 23.38 -14 18.76 -14 14 C-9.38 14 -4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#000000"
      transform="translate(308,518)"
    />
    <path
      d="M0 0 C13.86 0 27.72 0 42 0 C42 9.24 42 18.48 42 28 C37.38 28 32.76 28 28 28 C28 32.62 28 37.24 28 42 C18.76 42 9.52 42 0 42 C0 37.38 0 32.76 0 28 C-4.62 28 -9.24 28 -14 28 C-14 23.38 -14 18.76 -14 14 C-9.38 14 -4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#000000"
      transform="translate(406,518)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#0E0211"
      transform="translate(336,616)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#0C020F"
      transform="translate(560,602)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#0C020F"
      transform="translate(546,588)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#0B020E"
      transform="translate(532,574)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#0F0213"
      transform="translate(210,574)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#0E0211"
      transform="translate(238,560)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#130318"
      transform="translate(490,546)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#0F0213"
      transform="translate(434,518)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#0D0210"
      transform="translate(210,476)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#100314"
      transform="translate(518,392)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#0D0210"
      transform="translate(294,364)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#0E0211"
      transform="translate(392,336)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#130317"
      transform="translate(294,322)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#0E0211"
      transform="translate(224,322)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#100314"
      transform="translate(518,252)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#0A020D"
      transform="translate(280,210)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#110315"
      transform="translate(406,196)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#0A020D"
      transform="translate(168,154)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#130317"
      transform="translate(406,140)"
    />
    <path
      d="M0 0 C4.62 0 9.24 0 14 0 C14 4.62 14 9.24 14 14 C9.38 14 4.76 14 0 14 C0 9.38 0 4.76 0 0 Z "
      fill="#0E0211"
      transform="translate(420,98)"
    />
  </svg>
));
