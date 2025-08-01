"use client"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Phone, Send, Loader2 } from "lucide-react"
import { useState } from "react"
import { useProfile } from "../../context/ProfileContext"

export const VerificationModal = () => {
    const { verificationType, setShowVerificationModal, seller } = useProfile()
    const [verificationCode, setVerificationCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<"send" | "verify">("send")

    const handleSendCode = async () => {
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            setLoading(false)
            setStep("verify")
        }, 1000)
    }

    const handleVerifyCode = async () => {
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            setLoading(false)
            setShowVerificationModal(false)
            setStep("send")
            setVerificationCode("")
        }, 1000)
    }

    const isEmail = verificationType === "email"
    const contact = isEmail ? seller?.email : seller?.phone

    return (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    {isEmail ? <Mail className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                    Verify {isEmail ? "Email" : "Phone Number"}
                </DialogTitle>
                <DialogDescription>
                    {step === "send"
                        ? `We'll send a verification code to your ${isEmail ? "email address" : "phone number"}.`
                        : `Enter the verification code sent to ${contact}`}
                </DialogDescription>
            </DialogHeader>

            <div className="py-4">
                {step === "send" ? (
                    <div className="space-y-4">
                        <div className="bg-muted/30 p-4 rounded-lg">
                            <div className="flex items-center gap-2">
                                {isEmail ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                                <span className="font-medium">{contact}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="verification-code">Verification Code</Label>
                            <Input
                                id="verification-code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                className="text-center text-lg tracking-widest"
                            />
                        </div>
                    </div>
                )}
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={() => setShowVerificationModal(false)}>
                    Cancel
                </Button>
                {step === "send" ? (
                    <Button onClick={handleSendCode} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Send Code
                            </>
                        )}
                    </Button>
                ) : (
                    <Button onClick={handleVerifyCode} disabled={loading || verificationCode.length !== 6}>
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            "Verify"
                        )}
                    </Button>
                )}
            </DialogFooter>
        </DialogContent>
    )
}
