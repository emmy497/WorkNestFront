import Logo from "../components/Logo";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-[url('/images/formBg.png')] bg-cover bg-center bg-no-repeat bg-[hsla(248,100%,92%,1)] flex justify-center items-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-[444px]">
        <div className="flex justify-center mb-[15px]">
          <Logo />
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
