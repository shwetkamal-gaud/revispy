'use client'

import { useState } from "react";
import { motion } from "framer-motion";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { Payload } from "@/types/types";
import { ArrowRight } from "lucide-react";
import { toast } from "react-toastify";


const AuthPage = ({ type }: { type: "login" | "signup" }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otpRequested, setOtpRequested] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
    const [name, setName] = useState("");
    const router = useRouter()
    const { setAuthUser } = useAuthContext()
    const handleOtpChange = (index: number, value: string) => {
        if (/^\d$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (index < otp.length - 1) {
                document.getElementById(`otp-${index + 1}`)?.focus();
            }
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const newOtp = [...otp];

            if (otp[index]) {
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                document.getElementById(`otp-${index - 1}`)?.focus();
                newOtp[index - 1] = '';
                setOtp(newOtp);
            }
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").trim();
        if (/^\d{8}$/.test(pasteData)) { 
            const newOtp = pasteData.split("");
            setOtp(newOtp);
            document.getElementById(`otp-${newOtp.length - 1}`)?.focus();
        }
    };
    

    const handleVerifyOTP = async () => {
        const enteredOTP = otp.join("");
        const res = await fetch(`/api/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp: enteredOTP }),
            credentials: 'include'
        });

        const data = await res.json();
        if (res.ok) {
            setAuthUser(data)
            localStorage.setItem("user", JSON.stringify(data))
            router.push('/')
        } else {
            toast.error(data?.error || "Invalid OTP")
        }
    };

    const handleLoginOrSignup = async () => {
        const url = type === "signup" ? `/api/auth/signup` : `/api/auth/login`;
        const payload: Payload = { email, password };

        if (type === "signup") {
            payload.name = name;
        }

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: 'include'
        });

        const data = await res.json();
        if (res.ok) {
            if (type === 'login') {
                setAuthUser(data)
                localStorage.setItem("user", JSON.stringify(data))
                router.push('/')
            }
            else {
                setOtpRequested(true)
            }
            toast.success(data?.message || ``)

        } else {
            toast.error(data?.error || `${type} Failed`)
        }
    };
    const maskEmail = (email: string) => {
        const [name, domain] = email.split("@");
        const maskedName = name.substring(0, 3) + "***";
        return `${maskedName}@${domain}`;
    };
    return (
        <div className="flex flex-grow items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className=" backdrop-blur-lg shadow-lg dark:shadow-2xl border-2 border-[#C1C1C1] dark:bg-[#2e2d2b]  rounded-lg px-15 py-7 max-w-[500px]"
            >
                {!otpRequested ?
                    <>
                        <motion.h2 className="text-[32px] font-[600] mb-2 dark:text-white text-gray-900 text-center">
                            {type === "login" ? "Login" : "Create your account"}
                        </motion.h2>

                        <p className="text-gray-900 dark:text-white/70 font-[500] text-[24px] mb-4 text-center">
                            {type === 'login' && 'Welcome back to ECOMMERCE'}
                        </p>
                        <p className="text-gray-600 dark:text-white/70 text-[16px] mb-4 text-center">
                            {type === 'login' && 'The next gen business marketplace'}
                        </p>

                        <form className="w-full space-y-4 text-gray-600 dark:text-white/70" onSubmit={e => e.preventDefault()}>
                            {type === 'signup' && <>

                                <label className='text-black dark:text-white/80' htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Name"
                                    className="w-full px-4 py-2 border rounded focus:outline-none "
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </>
                            }
                            <label className='text-black dark:text-white/80' htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-2 border rounded focus:outline-none "
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />

                            <label className='text-black dark:text-white/80' htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-2 border rounded focus:outline-none "
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />




                            <button
                                type="button"
                                onClick={handleLoginOrSignup}
                                className="bg-black dark:bg-white dark:text-black text-white px-4 py-2 rounded w-full"
                            >
                                {type === "login" ? "Login" : "Create Account"} <ArrowRight size={18} className="inline ml-1" />
                            </button>

                        </form>



                        <div className="mt-4 text-center border-t-1 border-gray-500 pt-4 text-gray-900 dark:text-white text-sm">
                            {type === "login" ? (
                                <p>
                                    {" Don't have an account?"}{" "}
                                    <Link href="/signup" className="text-black dark:text-white/80 font-bold hover:underline">Sign Up</Link>
                                </p>
                            ) : (
                                <p>
                                    have an account?{" "}
                                    <Link href="/login" className="text-black dark:text-white/80 font-bold hover:underline">Login</Link>
                                </p>
                            )}
                        </div>
                    </>
                    : <>
                        <motion.h2 className="text-[32px] font-[600] mb-2 dark:text-white text-gray-900 text-center">
                            Verify your email
                        </motion.h2>
                        <p className="text-gray-600 dark:text-white/70 text-[16px] mb-4 text-center">
                            Enter the 8 digit code you have received on{" "}
                            {maskEmail(email)}
                        </p>

                        <form className="flex gap-2 justify-center">

                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    className="w-12 h-12 text-center  text-xl border dark:border-white rounded"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    onPaste={(e) => handleOtpPaste(e)}
                                />
                            ))}

                        </form>
                       
                        <button
                            type="button"
                            onClick={handleVerifyOTP}
                            className="bg-black dark:bg-white dark:text-black text-white mt-3 px-4 py-2 rounded w-full"
                        >
                            Verify
                        </button>
                    </>
                }
            </motion.div>
        </div >
    );
};

export default AuthPage;
