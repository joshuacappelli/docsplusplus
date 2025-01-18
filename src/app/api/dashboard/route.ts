import { NextResponse } from "next/server";
import { getTextBlocksFromDb, getDocumentsFromDb, createDocumentInDb, updateTextBlockInDb, deleteTextBlockInDb, deleteDocumentInDb, updateDocumentinDb, createTextBlockInDb, reorderTextBlockInDb, updateDoneTextBlockInDb } from "@/db/queries";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });
    if (!token || !token.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(token.sub);
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const documentId = searchParams.get('documentId');

    switch (action) {
      case 'getDocuments':
        const documents = await getDocumentsFromDb(userId);
        return NextResponse.json({ success: true, data: documents });

      case 'getBlocks':
        if (!documentId) {
          return NextResponse.json({ error: "Document ID required" }, { status: 400 });
        }
        const blocks = await getTextBlocksFromDb(parseInt(documentId), userId);
        return NextResponse.json({ success: true, data: blocks });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    if (!token || !token.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, documentId, text, title, textBlockId, type, newOrder, block } = await request.json();
    const userId = parseInt(token.sub);

    switch (action) {
      case 'create':
        const newDoc = await createDocumentInDb(userId, title);
        return NextResponse.json({ success: true, data: newDoc });
            
      case 'createBlock':
        const newBlock = await createTextBlockInDb(documentId, userId, text, type);
        return NextResponse.json({ success: true, data: newBlock });

      case 'updateBlock':
        const updatedBlock = await updateTextBlockInDb(textBlockId, documentId, userId, text);
        return NextResponse.json({ success: true, data: updatedBlock });

      case 'updateDoneBlock':
        const updatedDoneBlock = await updateDoneTextBlockInDb(documentId, userId, block);
        return NextResponse.json({ success: true, data: updatedDoneBlock });

      case 'reorderBlock':
        const reorderedBlock = await reorderTextBlockInDb(textBlockId, documentId, userId, newOrder);
        return NextResponse.json({ success: true, data: reorderedBlock });

      case 'deleteDocument':
        if (!documentId) {
          return NextResponse.json({ error: "Document ID required" }, { status: 400 });
        }
        await deleteDocumentInDb(userId, parseInt(documentId));
        return NextResponse.json({ success: true });

      case 'updateDocument':
        const updatedDoc = await updateDocumentinDb(userId,documentId,title);
        return NextResponse.json({ success: true, data: updatedDoc });

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token || !token.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = parseInt(token.sub);

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const documentId = searchParams.get('documentId');
  const textBlockId = searchParams.get('textBlockId');

  switch (action) {
    case 'deleteDocument':
      if (!documentId) {
        return NextResponse.json({ error: "Document ID required" }, { status: 400 });
      }
      await deleteDocumentInDb(userId, parseInt(documentId));
      return NextResponse.json({ success: true });

    case 'deleteBlock':
      if (!documentId || !textBlockId) {
        return NextResponse.json({ error: "Document ID and Text Block ID required" }, { status: 400 });
      }
      await deleteTextBlockInDb(parseInt(textBlockId), parseInt(documentId), userId);
      return NextResponse.json({ success: true });

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}

