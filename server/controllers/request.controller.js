import HistoryModel from "../models/History.model.js";
import { executeRequest } from "../services/request.service.js";

export const sendRequest = async (req, res) => {

  try {
    const response = await executeRequest(req.body);

await HistoryModel.create({
  user: req.user.id,
  method: req.body.method,
  url: req.body.url,
  headers: req.body.headers,
  body: req.body.body,
  auth: req.body.auth,
  status: response.status,
  responseTime: response.responseTime,
});

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