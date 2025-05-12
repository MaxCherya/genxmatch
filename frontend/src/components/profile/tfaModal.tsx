import React, { useEffect, useState } from "react";
import { enable2FA, confirm2FA, disable2FA } from "../../endpoints/auth";
import { useToast } from "../../contexts/ToastContext";
import { useTranslation } from "react-i18next";

interface TfaModalProps {
    onClose: () => void;
}

const TfaModal: React.FC<TfaModalProps> = ({ onClose }) => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [manualCode, setManualCode] = useState<string | null>(null);
    const [otp, setOtp] = useState<string>("");

    const { t } = useTranslation();

    const { addToast } = useToast();
    const [alreadyEnabled, setAlreadyEnabled] = useState<boolean>(false);

    useEffect(() => {
        const setup2FA = async () => {
            try {
                const res = await enable2FA();
                setQrCode(res.qr_code);
                setManualCode(res.manual_code);
            } catch (err: any) {
                if (err?.error === "2FA_ALREADY_ENABLED") {
                    setAlreadyEnabled(true);
                }
                addToast(err?.message || t('profile.2fa_error'), "warning");
            }
        };
        setup2FA();
    }, []);

    const handleConfirm = async () => {
        try {
            await confirm2FA(otp);
            addToast(t('profile.2fa_enabled'), "success");
            setTimeout(() => onClose(), 1500);
        } catch (err: any) {
            addToast(err?.error || t('profile.invalid_otp'), "error");
        }
    };

    const handleDisable = async () => {
        try {
            await disable2FA(otp);
            addToast(t('profile.2fa_disabled'), "success");
            setTimeout(() => onClose(), 1500);
        } catch (err: any) {
            addToast(err?.error || t('profile.invalid_otp'), "error");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center max-h-[95%] justify-center bg-black bg-opacity-70 p-4 overflow-x-hidden">
            <div className="relative w-[99%] max-w-lg bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-6 shadow-xl border border-gray-700 overflow-x-hidden">
                <button onClick={onClose} className="absolute cursor-pointer top-3 right-4 text-2xl font-bold text-white hover:text-red-500 transition">
                    &times;
                </button>

                <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">
                    {alreadyEnabled ? "Disable Two-Factor Authentication" : "Setup Two-Factor Authentication"}
                </h2>

                {!alreadyEnabled && qrCode && (
                    <img src={qrCode} alt="2FA QR Code" className="mx-auto mb-4 max-w-[95%] lg:max-w-[75%] rounded-md border border-gray-600" />
                )}

                {!alreadyEnabled && manualCode && (
                    <p
                        className="text-center text-sm text-gray-300 mb-6 cursor-pointer hover:underline"
                        onClick={() => {
                            navigator.clipboard.writeText(manualCode);
                            addToast(t('profile.manual_code_copied'), "info");
                        }}
                    >
                        {t('profile.manual_code')}:{" "}
                        <code className="bg-gray-800 px-2 py-1 rounded text-xs max-w-[95%] text-indigo-300">{manualCode}</code>
                    </p>
                )}

                <div className="mb-6">
                    <label className="block text-sm mb-2 text-gray-400">
                        {alreadyEnabled ? t('profile.enter_otp_disable_2fa') : t('profile.enter_otp_from_app')}
                    </label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="123456"
                    />
                </div>

                <button
                    onClick={alreadyEnabled ? handleDisable : handleConfirm}
                    className={`w-full cursor-pointer py-2 rounded transition font-semibold ${alreadyEnabled
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                >
                    {alreadyEnabled ? t('profile.disable_2fa') : t('btns.confirm')}
                </button>
            </div>
        </div>
    );
};

export default TfaModal;