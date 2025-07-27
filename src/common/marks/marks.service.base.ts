import { MarkBase } from "./mark.base";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

export abstract class MarksServiceBase {
    protected abstract readonly _repo: Repository<MarkBase>;

    async didMark(userId: number, targetId: number): Promise<boolean> {
        return this._repo.existsBy({ userId, targetId });
    }

    /**
     * Delete mark if exists or insert mark,
     * and return amount of change in number of marks attached to target
     * @param userId
     * @param targetId
     * @protected
     */
    @Transactional()
    async updateMark(
        userId: number,
        targetId: number,
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

    async getTargetIds(userId: number): Promise<number[]> {

        const marks = await this._repo.find({
            where: { userId },
            select: ["targetId"]
        });

        return marks.map(m  => m.targetId);
    }
}