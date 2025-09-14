import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function PUT(request: NextRequest) {
  if (
    request.headers.get("X-Headless-Secret-Key") !== process.env.HEADLESS_SECRET
  ) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const requestBody = await request.text();
  const { paths } = requestBody
    ? JSON.parse(requestBody)
    : { paths: [] };

  try {
    // Always revalidate the HomePage tag
    await revalidateTag("HomePage");
    console.log("Successfully revalidated tag: HomePage");

    // Also revalidate any paths sent in the request
    if (paths && Array.isArray(paths) && paths.length > 0) {
      await Promise.all(paths.map((path) => revalidatePath(path)));
      console.log("Successfully revalidated paths:", paths);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      revalidatedHomePage: true,
      revalidatedPaths: paths || [],
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { message: "Error during revalidation" },
      { status: 500 },
    );
  }
}
