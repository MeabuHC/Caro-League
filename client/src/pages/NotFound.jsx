import { Link } from "react-router-dom";
import { HomeFilled } from "@ant-design/icons";

export default function NotFound() {
  return (
    <>
      <div className="h-screen bg-[#312E2B] flex items-center justify-center relative">
        <Link to={"/"}>
          <HomeFilled className="absolute top-[20px] left-[25px] text-[#989795] text-xl" />
        </Link>
        <div className="w-[600px] bg-[#272522] flex flex-col items-center justify-center p-6 gap-4 mt-5">
          <div className="header w-full flex flex-col items-center justify-center">
            <h1 className="text-white font-bold text-3xl pb-5 mb-3 border-b-2 border-solid border-[#3D3B39] w-[80%] text-center">
              404 Page Not Found
            </h1>
            <Link
              className="h-[40px] bg-[#3D3B39] hover:bg-[#3D3B39] text-[#C3C0C2] hover:text-[#E3E3E3] px-5 py-2 font-semibold rounded-lg"
              to={"/"}
            >
              Return Home
            </Link>
          </div>
          <div className="body">
            <img
              src="https://www.chess.com/bundles/web/images/404-pawn.f17f262c.gif"
              alt="404-gif"
              className="w-[420px] h-[420px]"
            />
          </div>
        </div>
      </div>
    </>
  );
}
