import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { login, register } from "../../endpoints/auth";
import { useAuth } from "../../contexts/authContext";
import { useTranslation } from "react-i18next";
import { useToast } from "../../contexts/ToastContext";

interface NavbarUserMenuProps {
    onClose?: () => void;
}

const NavbarUserMenu: React.FC<NavbarUserMenuProps> = ({ onClose }) => {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otpOpened, setOtpOpened] = useState<boolean>(false)
    const [otp, setOtp] = useState<string | undefined>()

    const otpInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (otpOpened && otpInputRef.current) {
            otpInputRef.current.focus();
        }
    }, [otpOpened]);

    const { t } = useTranslation();
    const { addToast } = useToast();

    const { setUser } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp) {
            if (otpOpened && otp.length < 6) {
                addToast(t("registration.enter_valid_otp"), "error");
                return;
            }
        }

        if (mode === "register" && password !== confirmPassword) {
            addToast(t('registration.passwords_do_not_match'), "error");
            return;
        }

        if (mode === 'login') {
            try {
                const payload: any = { username, password };
                if (otpOpened && otp) {
                    payload.otp = otp;
                }
                const res = await login(payload);
                setUser(res.user);
                addToast(t('registration.login_successful'), "success");
                onClose?.();
            } catch (err: any) {
                if (err.error_id === 'OTP_Enabled') {
                    setOtpOpened(true)
                } else {
                    addToast(err.error || t('registration.login_failed'), "error");
                }
            }
        } else {
            try {
                const res = await register({ username, email, password });
                setUser(res.user);
                addToast(res.message || t('registration.registration_successful'), "success");
                onClose?.();
            } catch (err: any) {
                addToast(err.error || t('registration.registration_failed'), "error");
            }
        }
    };

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black/80 z-[9999] flex items-center justify-center p-4">

            {otpOpened && (
                <div className="fixed h-screen w-screen inset-0 bg-black/70 z-[9999]">
                    <form
                        onSubmit={handleSubmit}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] h-[30%] lg:w-[30%] lg:h-[30%] 
                        bg-white rounded-xl shadow-2xl border border-gray-300 flex flex-col items-center justify-center gap-4 px-6 py-8 text-black"
                    >
                        <div className="flex flex-col items-center text-center">
                            <h1 className="text-xl font-semibold mb-1">{t('registration.enter_2fa_code')}</h1>
                            <p className="text-sm text-gray-600">{t('registration.enter_6_digit_code')}</p>
                        </div>

                        <input
                            ref={otpInputRef}
                            type="text"
                            placeholder="123456"
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            className="text-center tracking-widest text-lg py-2 px-4 border border-gray-300 rounded-md w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <button
                            type="submit"
                            className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-md transition duration-200"
                        >
                            {t('btns.confirm')}
                        </button>
                    </form>
                </div>
            )
            }

            <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-2xl max-w-md w-full border border-gray-800 transform transition-all duration-300">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-light tracking-wide text-white">
                            {mode === "login" ? t('registration.sign_in') : t('registration.register')}
                        </h1>
                        <button
                            onClick={onClose}
                            className="text-gray-400 cursor-pointer hover:text-white transition-colors duration-200"
                            aria-label="Close modal"
                        >
                            <AiOutlineClose size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <AiOutlineMail className="absolute top-3 left-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                                required
                            />
                        </div>

                        {mode === "register" && (
                            <div className="relative">
                                <AiOutlineMail className="absolute top-3 left-3 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('registration.email')}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                                    required
                                />
                            </div>
                        )}

                        <div className="relative">
                            <AiOutlineLock className="absolute top-3 left-3 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('registration.password')}
                                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                                required
                            />
                        </div>

                        {mode === "register" && (
                            <div className="relative">
                                <AiOutlineLock className="absolute top-3 left-3 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder={t('registration.confirm_password')}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                                    required
                                />
                            </div>
                        )}

                        {mode === "login" && (
                            <div className="flex justify-end">
                                <a
                                    href="#"
                                    className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
                                    onClick={(e) => {
                                        e.preventDefault();
                                    }}
                                >
                                    {t('registration.forgot_password')}
                                </a>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold text-sm"
                        >
                            {mode === "login" ? t('registration.login') : t('registration.register')}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        {mode === "login" ? (
                            <p className="text-sm text-gray-400">
                                {t('registration.no_account')}{" "}
                                <button
                                    onClick={() => setMode("register")}
                                    className="text-blue-600 cursor-pointer hover:text-blue-500 transition-colors duration-200 font-semibold"
                                >
                                    {t('registration.register')}
                                </button>
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400">
                                {t('registration.already_have_account')}{" "}
                                <button
                                    onClick={() => setMode("login")}
                                    className="text-blue-600 cursor-pointer hover:text-blue-500 transition-colors duration-200 font-semibold"
                                >
                                    {t('registration.sign_in')}
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavbarUserMenu;