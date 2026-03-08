export const main_handler = async (event, context) => {
  try {
    const PAT = "pat_2wPzubbswoDFH3LCwkMp8Ch9kCXCw3XMUFWuoF94V5xaLX3nZ4JSsXtgVcfKNkmT";  // 替换成你的 PAT
    const BOT_ID = "7598917724571779135";

    const body = JSON.parse(event.body || "{}");
    const userMessage = body.message || "你好";

    const createRes = await fetch("https://api.coze.cn/open_api/v2/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PAT}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        bot_id: BOT_ID,
        user: "user_123",
        query: userMessage,
        stream: false
      })
    });

    const createData = await createRes.json();
    console.log("createData:", createData);

    // 判断是否成功（code 为 0 表示成功）
    if (createData.code !== 0) {
      throw new Error(`Coze API 错误: ${createData.msg}`);
    }

    // 从 messages 中提取 assistant 的回复
    let reply = "小黑暂时没有回复";
    if (createData.messages) {
      const assistantMessage = createData.messages.find(
        m => m.role === "assistant" && m.type === "answer"
      );
      if (assistantMessage) {
        reply = assistantMessage.content;
      }
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
      },
      body: JSON.stringify({
        success: true,
        reply
      })
    };

  } catch (error) {
    console.error("错误:", error);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        success: false,
        error: "服务器错误"
      })
    };
  }
};