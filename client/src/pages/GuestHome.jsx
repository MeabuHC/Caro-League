import React, { useEffect } from "react";
import CaroTableSpectator from "../components/caro-battle/CaroTableSpectator";
import cute_botSVG from "../assets/svg/cute-bot.svg";
import banner from "../assets/images/fwc24_banner_index.4e29257c.jpg";
import { useUserContext } from "../context/UserContext";
import { Link, replace, useNavigate } from "react-router-dom";

export default function GuestHome() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/home", { replace: true });
  }, []);

  return (
    <div className="bg-[#302E2B] w-full h-full max-h-full overflow-auto container">
      {/* Intro Block */}
      <div className="intro-block flex flex-row gap-10 px-10 py-10 w-[1100px] mx-auto">
        {/* Left Side */}
        <CaroTableSpectator
          moveHistory={{ boardState: createBoard() }}
          size="medium"
        />
        {/* Right Side */}
        <div className="intro flex flex-col items-center ml-auto">
          <h1 className="text-white font-bold text-5xl text-center pb-4">
            Play Caro Online <br />
            on the #1 Site!
          </h1>
          <div className="intro-info flex flex-row gap-7 text-[#989795] text-lg mb-8">
            <span className="info-item">
              <span className="info-value text-white">15,596,370 </span> Games
              Today
            </span>
            <span className="info-item">
              <span className="info-value text-white">189,049 </span> Playing
              Now
            </span>
          </div>
          {/* Buttons */}
          <div className="buttons-wrap flex flex-col gap-4">
            {/* Play Online Button */}

            <Link
              to={"/login"}
              className="w-[352px] h-[90px] bg-[#81B64C] hover:bg-[#A3D160] pt-[15px] pb-[20px] px-[24px] rounded-lg flex flex-row gap-3 text-white hover:text-white  border-b-4 border-[#45753c] shadow-lg hover:shadow-[0_0_10px_2px_rgba(255,255,255,0.5)] transition-all duration-300"
            >
              <div className="button-icon w-[55px] h-full flex flex-row">
                <div className="font-caroFont text-3xl self-center">
                  <span className="text-red-400">X</span>
                  <span className="text-blue-400">O</span>
                </div>
              </div>
              <div className="button-text text-left">
                <p className="mb-1 text-xl font-bold">Play Online</p>
                <p className="font-normal text-sm">
                  Play with someone at your level
                </p>
              </div>
            </Link>
            {/* Play Bot Button */}
            <Link
              to={"/caro/computer"}
              className="w-[352px] h-[90px] bg-[#454341] hover:bg-[#454341] pt-[15px] pb-[20px] px-[24px] rounded-lg flex flex-row gap-3 text-[#C5C5C4] hover:text-[#E1E1E0] border-b-4 border-[rgba(0,0,0,0.1)] shadow-lg hover:shadow-[0_0_10px_2px_rgba(255,255,255,0.5)] transition-all duration-300"
            >
              <div className="button-icon w-[55px] h-full flex flex-row">
                <img src={cute_botSVG}></img>
              </div>
              <div className="button-text text-left">
                <p className="mb-1 text-xl font-bold">Play Bots</p>
                <p className="font-normal text-sm">
                  Play vs customizable training bots
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="advertise-banner flex flex-row gap-10 px-10 pb-10 w-[1100px] mx-auto">
        <img src={banner} className="w-full" />
      </div>
    </div>
  );
}

function createBoard() {
  const board = Array.from({ length: 15 }, () => Array(20).fill(null));

  //Face
  drawHorizontalLine(board, "O", 1, 6, 13);
  board[2][5] = "O";
  board[3][4] = "O";
  drawVerticalLine(board, "O", 3, 4, 10);

  board[2][14] = "O";
  board[3][15] = "O";
  drawVerticalLine(board, "O", 16, 4, 10);

  board[11][4] = "O";
  board[12][5] = "O";

  board[11][15] = "O";
  board[12][14] = "O";

  drawHorizontalLine(board, "O", 13, 6, 13);

  board[9][5] = "X";
  board[10][6] = "X";

  drawHorizontalLine(board, "X", 11, 7, 12);

  board[9][14] = "X";
  board[10][13] = "X";

  //Eyes
  // board[4][7] = "X";
  // board[5][6] = "X";
  // board[5][8] = "X";
  // board[6][7] = "X";
  board[5][7] = "O";

  // board[4][12] = "X";
  // board[5][11] = "X";
  // board[5][13] = "X";
  // board[6][12] = "X";
  board[5][12] = "O";

  return board;
}

function drawHorizontalLine(board, symbol, row, start, end) {
  for (let i = start; i <= end; i++) {
    board[row][i] = symbol;
  }
}

function drawVerticalLine(board, symbol, column, start, end) {
  for (let i = start; i <= end; i++) {
    board[i][column] = symbol;
  }
}
