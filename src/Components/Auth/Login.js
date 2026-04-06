import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  login,
  handleForgotPassword,
  sendUserOTP,
  resendUserOTP,
  verifyUserOTP,
} from "./authAPI";
import logo from "../../assets/logo.png";
import { InputText } from "primereact/inputtext";
import { toast } from "react-toastify";
import { CircleAlert, CircleCheckBig, Eye, EyeOff, Loader2, MoveLeft, Verified } from "lucide-react";
import { Button } from "../../ui/buttons";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Label } from "@radix-ui/react-label";
import { InputOtp } from "primereact/inputotp";

export default function Login() {
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerfied] = useState(false);
  const [password, setPassword] = useState("");
  const [otp, setOTP] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = () => {
    dispatch(login({ email, password })).then((action) => {
      if (login.fulfilled.match(action)) {
        const user = action.payload.user;

        toast.success(`Welcome ${user.name}`);
        console.log(action.payload);

        setTimeout(() => {
          navigate("/product-management");
        }, 3000);
      } else {
        toast.error(action.payload || "Login failed");
      }
    });
  };

  const handleAction = (email) => {
    if (!email) {
      // show error toast / alert
      toast.error("Please enter a valid username or email address");
      return;
    }

    setDialogOpen(true);
    handleSendOTP(email);
  };

  const handleSendOTP = useCallback(
    async (email) => {
      try {
        const actionResult = await dispatch(sendUserOTP({ email }));
        if (sendUserOTP.fulfilled.match(actionResult)) {
          toast.success("OTP sent!");
          return;
        }
        toast.error(actionResult.payload || "Something went wrong");
      } catch (error) {
        toast.error("An error occurred while sending OTP.");
      }
    },
    [dispatch],
  );

  const handleReSendOTP = useCallback(
    async (email) => {
      try {
        const actionResult = await dispatch(resendUserOTP({ email }));
        if (resendUserOTP.fulfilled.match(actionResult)) {
          toast.success("OTP re-sent!");
          return;
        }
        toast.error(actionResult.payload || "Something went wrong");
      } catch (error) {
        toast.error("An error occurred while sending OTP.");
      }
    },
    [dispatch],
  );

  const handleVerifyOTP = useCallback(
    async (email, otp) => {
      try {
        const actionResult = await dispatch(verifyUserOTP({ email, otp }));
        if (verifyUserOTP.fulfilled.match(actionResult)) {
          toast.success("OTP verified!");
          setEmailVerfied(true);
          setDialogOpen(false);
          return;
        }
        toast.error(actionResult.payload || "Something went wrong");
      } catch (error) {
        toast.error("An error occurred while sending OTP.");
      }
    },
    [dispatch],
  );

  const handleResetPassword = useCallback(
    async (newPassword, confirmNewPassword) => {
      try {
        if (!emailVerified) {
          toast.info("Please verify user first");
          return;
        }
        if (!newPassword || !confirmNewPassword) {
          toast.info("Please enter new Password");
          return;
        }
        if (newPassword !== confirmNewPassword) {
          toast.info("Password should be same");
          return;
        }
        const actionResult = await dispatch(
          handleForgotPassword({ email, newPassword, otp }),
        );
        if (handleForgotPassword.fulfilled.match(actionResult)) {
          toast.success("Password reset successfully!");
          setEmailVerfied(false);
          setForgotPassword(false);
          setNewPassword("");
          setOTP("");
          setConfirmNewPassword("");
          return;
        }
        toast.error(actionResult.payload || "Failed to reset Password");
      } catch (error) {
        toast.error("An error occurred while resetting password");
      }
    },
    [dispatch, email, emailVerified, otp],
  );

  const customInput = ({ events, props }) => (
    <input {...events} {...props} type="text" className="custom-otp-input" />
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[hsl(221,41%,12%)] via-[hsl(223,57%,25%)] to-[hsl(271,38%,23%)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[hsl(220,90%,56%,0.08)] blur-[100px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[hsl(270,76%,54%,0.08)] blur-[100px]" />
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-[hsl(168,76%,42%,0.06)] blur-[80px]" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-white h-fit w-72 py-1.5 px-3 rounded-2xl mb-3 shadow-[0_8px_32px_hsl(220,90%,56%,0.3)] animate-[float_2s_ease-in-out_infinite]">
            <img src={logo} alt="" className="h-fit w-fit" />
          </div>
          <h1
            className="text-3xl font-extrabold text-white tracking-tight"
            data-testid="text-app-title"
          >
            Archiworld Admin
          </h1>
        </div>

        <div className="rounded-xl bg-white/[0.07] backdrop-blur-xl border border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-white">Welcome back</h2>
            <p className="text-[hsl(220,20%,60%)] text-sm mt-1">
              {forgotPassword ? "Reset Password" : " Sign in to your account"}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-2"
          >
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-[hsl(220,20%,78%)] text-sm font-medium"
              >
                Email ID or username
              </Label>
              <div className="w-full flex gap-2 items-center just-fy-center">
                <InputText
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  required
                  disabled={emailVerified}
                  placeholder="Email ID or username"
                  className="px-4 py-2 w-full bg-transparent border border-gray-600 rounded-md shadow-none text-white"
                />
                {forgotPassword && (
                  <Button
                    variant={emailVerified ? "green" : "default"}
                    disabled={emailVerified}
                    onClick={() => handleAction(email)}
                  >
                    {emailVerified ? `Verified` : "Verify"}
                    {emailVerified ? <Verified /> : <></>}
                  </Button>
                )}
              </div>
            </div>
            {!forgotPassword && (
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-[hsl(220,20%,78%)] text-sm font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <InputText
                    type={showPassword ? "text" : "password"}
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-2 py-2 bg-transparent backdrop:blur border border-gray-600 rounded-md shadow-none text-white"
                  />
                  <button
                    type="button"
                    data-testid="button-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(220,20%,50%)] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
            {!forgotPassword && (
              <p
                onClick={() => setForgotPassword(true)}
                className="text-[hsl(220,20%,60%)] text-sm cursor-pointer underline text-start my-2"
              >
                Forgot Password?
              </p>
            )}
            {emailVerified && (
              <div className="w-full flex flex-col gap-2">
                <div className="relative">
                  <InputText
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    required
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full px-2 py-2 bg-transparent backdrop:blur border border-gray-600 rounded-md shadow-none text-white"
                  />
                  <button
                    type="button"
                    data-testid="button-toggle-password"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(220,20%,50%)] transition-colors"
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <InputText
                    type={showConfirmNewPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    required
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="w-full px-2 py-2 bg-transparent backdrop:blur border border-gray-600 rounded-md shadow-none text-white"
                  />
                  <button
                    type="button"
                    data-testid="button-toggle-password"
                    onClick={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(220,20%,50%)] transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmNewPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div>
                  {newPassword &&
                    confirmNewPassword &&
                    (newPassword === confirmNewPassword ? (
                      <span className="text-green-600 flex items-center gap-2">
                        <CircleCheckBig className="w-4 h-4" />
                        Password Matched
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-2">
                        <CircleAlert className="w-4 h-4" />
                        Password Not matched
                      </span>
                    ))}
                </div>
              </div>
            )}
            {!forgotPassword && (
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[hsl(220,90%,56%)] to-[hsl(250,80%,58%)] border-[hsl(220,90%,50%)] text-white font-semibold rounded-md py-3 flex justify-center items-center"
                disabled={loading}
                data-testid="button-login"
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Sign In
              </button>
            )}
            {forgotPassword && (
              <div className="flex gap-2 justify-center items-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEmailVerfied(false);
                    setForgotPassword(false);
                    setNewPassword("");
                    setOTP("");
                    setConfirmNewPassword("");
                  }}
                  className="text-[hsl(220,20%,60%)]"
                >
                  <MoveLeft />
                  Back
                </Button>
                <Button
                  onClick={() =>
                    handleResetPassword(newPassword, confirmNewPassword)
                  }
                >
                  Reset
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>

      <style>{`
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`}</style>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[90%] lg:max-w-[40%]">
          <DialogHeader>
            <DialogTitle>Verfiy User</DialogTitle>
            <div className="flex flex-col items-center gap-1 justify-center">
              <Label>
                Enter OTP <span className="text-red-600">*</span>
              </Label>
              <style scoped>
                {`
          .custom-otp-input {
            width: 30px;
            font-size: 20px;
            border: 0 none;
            appearance: none;
            text-align: center;
            transition: all 0.2s;
            background: transparent;
            border-radius: 2px;
            border: 1px solid var(--surface-500);
          }
          .custom-otp-input:focus {
            outline: none;
            border-color: var(--primary-color);
          }
        `}
              </style>
              <InputOtp
                value={otp}
                onChange={(e) => setOTP(e.value)}
                length={6}
                integerOnly
                style={{ gap: 2 }}
                inputTemplate={customInput}
              />
              <button
                onClick={() => handleReSendOTP(email)}
                className="text-primary underline-offset-4 hover:underline text-sm"
              >
                Resend OTP
              </button>
            </div>
          </DialogHeader>
          <DialogFooter>
            <div className="w-full lg:w-fit flex flex-wrap justify-center lg:items-center gap-2">
              <Button
                onClick={() => {
                  setDialogOpen(false);
                  setOTP("");
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleVerifyOTP(email, otp)}
                variant="green"
              >
                Verify
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
