export const isPrismaConnectionError = (error: any): boolean => {
    const msg = error?.message || "";
    return (
      error?.code === "P1001" ||
      error?.code === "P2024" ||
      msg.includes("Can't reach database server") ||
      msg.includes("Timed out in fetching a new connection") ||
      msg.includes("PrismaClientInitializationError") ||
      msg.includes("ECONNREFUSED") ||
      msg.includes("connect ECONNRESET") ||
      msg.includes("ENOTFOUND") ||
      msg.includes("Connection terminated unexpectedly")
    );
  };
  