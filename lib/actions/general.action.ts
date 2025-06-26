import { db } from "@/firebase/admin";

export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null> {
    const interview = await db.collection('interviews')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

        return interview.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
        })) as Interview[];
}

export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
    const { userId, limit= 20 } = params;

    const interview = await db.collection('interviews')
        .where('finalized', '==', true)
        .where('userId', '!=', userId)
        .limit(limit)
        .orderBy('createdAt', 'desc')
        .get();

        return interview.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
        })) as Interview[];
}

export async function getInterviewById(id: string): Promise<Interview | null> {
    const interview = await db.collection('interviews')
        .doc(id)
        .get();

        return interview.data() as Interview | null;
}