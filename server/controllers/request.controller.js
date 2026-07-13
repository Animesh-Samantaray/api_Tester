import { executeRequest } from "../services/request.service.js";

export const sendRequest = async (req, res) => {

  try {
    const response =
      await executeRequest(req.body);

    return res.status(200).json({
      success: true,
      data: response,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};