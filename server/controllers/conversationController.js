import conversationDAO from "../dao/conversationDAO.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const createConversation = catchAsync(async (req, res, next) => {
  const user1 = req.user;
  const { id: user2Id } = req.params;
  const data = await conversationDAO.create(user1._id.toString(), user2Id);

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getAllConversationMe = catchAsync(async (req, res, next) => {
  const user1 = req.user;
  const data = await conversationDAO.findConversationsByUser(
    user1._id.toString()
  );

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getConversationMessagesById = catchAsync(
  async (req, res, next) => {
    const user1 = req.user;
    const { id: conversationId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const data = await conversationDAO.getPaginatedMessages(
      conversationId,
      page,
      limit
    );

    res.status(200).json({
      status: "success",
      data: data,
    });
  }
);

export const sendMessage = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { message } = req.body;
  const { id: conversationId } = req.params;

  await conversationDAO.sendMessage(
    user._id.toString(),
    conversationId,
    message
  );

  res.status(200).json({
    status: "success",
    data: "hello",
  });
});
