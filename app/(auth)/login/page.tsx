import UserLoginForm from "../_components/UserLoginForm";

const loginPage = () => {
  return (
    <div className="min-h-screen flex  justify-center items-center">
      <div className=" w-full max-w-md space-y-6 border rounded-lg p-8 shadow-lg">
        {/* text */}
        <div className="text-center space-y-2">
          <h1 className="">Welcome Back</h1>
          <p>Enter your credentials to access your account</p>
        </div>
        {/* form */}
        <UserLoginForm/>
      </div>
    </div>
  );
};

export default loginPage;
