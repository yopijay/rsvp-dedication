import Banderitas from "@public/images/banderitas.png";
import Image from "next/image";

const InvitationCard = () => {
    return (
        <div className="flex flex-col bg-white rounded-lg shadow-lg w-full sm:max-w-[412px] sm:mx-auto relative min-h-125 overflow-hidden">
            <Image
                src={Banderitas}
                alt="Banderitas"
                priority
                className="pointer-events-none absolute -top-5 left-0 w-full select-none opacity-50"
            />
            <Image
                src={Banderitas}
                alt=""
                aria-hidden="true"
                priority
                className="pointer-events-none absolute -bottom-5 left-0 w-full rotate-180 select-none opacity-50"
            />
            <div className="p-10 flex flex-col items-center z-10">
                <div className="flex flex-col gap-y-2">
                    <p className="text-2xl uppercase w-4/5 text-[#4A78A8] leading-none text-center font-simple-handmade mx-auto">
                        Join us in thanksgiving and dedication
                    </p>
                    <div className="flex flex-col mx-auto">
                        <p className="text-2xl text-[#87AED1] leading-none text-center font-keshia">
                            Children are a gift from the Lord
                        </p>
                        <p className="text-md text-[#5F8FBD] leading-none text-right font-keshia">
                            Psalms 127:3
                        </p>
                    </div>
                </div>
                <div className="relative h-70 w-70 sm:h-80 sm:w-80">
                    <div className="absolute inset-y-[14%] inset-x-[12.5%] overflow-hidden rounded-[44%]">
                        <Image
                            src="/images/iskai.jpeg"
                            alt="Isaiah Kai"
                            fill
                            priority
                            sizes="(max-width: 640px) 220px, 280px"
                            className="object-cover object-center"
                        />
                    </div>
                    <Image
                        src="/images/cloud-circle.png"
                        alt="Cloud Circle"
                        fill
                        priority
                        sizes="(max-width: 640px) 280px, 320px"
                        className="pointer-events-none select-none object-contain"
                    />
                </div>
                <div className="flex flex-col gap-y-6 text-center">
                    <p className="text-5xl lg:text-7xl font-bold -mt-10 text-[#3F6F9B] leading-none text-center font-brittany-signature z-10">
                        Isaiah Kai
                    </p>
                    <p className="text-sm text-[#6E9CC6] leading-none text-center font-papernotes z-10">
                        By His grace, we present Isaiah Kai for Child
                        Dedication. As Hannah lent Samuel to the Lord, we pledge
                        to raise Isaiah Kai in a Christ-centered home. Please
                        join us in prayer for our child on
                    </p>
                    <div className="flex flex-col gap-y-2">
                        <div className="flex flex-row justify-center items-center gap-x-5">
                            <p className="text-5xl font-simple-handmade text-[#4A78A8]">
                                MAY
                            </p>
                            <p className="text-5xl font-simple-handmade text-[#4A78A8]">
                                9
                            </p>
                            <p className="text-5xl font-simple-handmade text-[#4A78A8]">
                                2026
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <p className="uppercase leading-none text-xl font-simple-handmade text-[#4A78A8]">{`At 3:30 o'clock in the afternoon`}</p>
                            <p className="uppercase leading-none text-xl font-simple-handmade text-[#4A78A8]">
                                JOLLIBEE QUIRINO HIGHWAY GULOD
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvitationCard;
