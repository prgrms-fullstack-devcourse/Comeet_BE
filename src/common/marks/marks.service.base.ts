import { MarkBase } from "./mark.base";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

export abstract class MarksServiceBase {
    protected abstract readonly _repo: Repository<MarkBase>;

    @Transactional()
    async updateMark(
       targetId: number,
       userId: number
    ): Promise<1 | -1> {
        const bookmark = await this._repo.findOneBy({ targetId, userId });

        if (bookmark) {
            await this._repo.delete(bookmark.id);
            return -1;
        }
        else {
            await this._repo.insert({ userId, targetId });
            return 1;
        }
    }

    async didMark(targetId: number, userId: number): Promise<boolean> {
        return this._repo.existsBy({ userId, targetId });
    }

    async getTargetIds(userId: number): Promise<number[]> {

        const marks = await this._repo.find({
            where: { userId },
            select: ["targetId"]
        });

        return marks.map(m  => m.targetId);
    }

    @Transactional()
    async onTargetDeleted(targetId: number): Promise<void> {
        const marks = await this._repo.findBy({ targetId });
        await this._repo.delete(marks.map(m => m.id));
    }

    
}