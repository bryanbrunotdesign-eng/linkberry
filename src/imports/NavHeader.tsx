import svgPaths from "./svg-xrhmkb8y";
import imgProfileIcon from "figma:asset/70017910a949817aa1c11716388ee64b40b2eafa.png";

function Logo() {
  return (
    <div className="content-stretch flex gap-[8px] items-center px-[12px] relative shrink-0" data-name="Logo">
      <div className="relative shrink-0 size-[24px]">
        <div className="absolute inset-[-4.57%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.1939 26.1939">
            <path d={svgPaths.p26ba3a00} id="Ellipse 22" stroke="url(#paint0_linear_1_1535)" strokeDasharray="0.11 4.39" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.19386" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1535" x1="5.71231" x2="21.4047" y1="1.09693" y2="25.097">
                <stop stopColor="#350A51" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <p className="font-['Avenir:Heavy',sans-serif] font-['Lexend:ExtraBold',sans-serif] font-extrabold leading-[0] not-italic relative shrink-0 text-[#331f59] text-[18px] text-center tracking-[-0.36px] whitespace-nowrap">
        <span className="leading-[16px]">Li</span>
        <span className="leading-[16px] tracking-[-0.96px]">n</span>
        <span className="leading-[16px]">kber</span>
        <span className="leading-[16px]">r</span>
        <span className="leading-[16px]">y</span>
      </p>
    </div>
  );
}

function NotificationHamburger() {
  return (
    <div className="content-stretch flex gap-[11px] items-center pr-[10px] relative shrink-0" data-name="Notification/Hamburger">
      <div className="relative shrink-0 size-[20px]" data-name="Profile Icon">
        <img alt="" className="absolute block max-w-none size-full" height="20" src={imgProfileIcon} width="20" />
      </div>
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="heroicons-outline/bell">
        <div className="absolute inset-[12.5%_15.37%]" data-name="Vector">
          <div className="absolute inset-[-4.17%_-4.51%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1227 19.5">
              <path d={svgPaths.p866c00} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 size-[24px]" data-name="heroicons-outline/bars-3">
        <div className="absolute inset-0 overflow-clip" data-name="heroicons-outline/bars-3">
          <div className="absolute inset-[28.13%_15.63%]" data-name="Vector">
            <div className="absolute inset-[-7.14%_-4.55%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 12">
                <path d={svgPaths.p110b7c50} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NavHeader() {
  return (
    <div className="content-stretch flex items-center justify-between px-[5px] relative size-full" data-name="Nav Header">
      <Logo />
      <NotificationHamburger />
    </div>
  );
}