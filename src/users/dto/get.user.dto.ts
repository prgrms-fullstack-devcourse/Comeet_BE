type __UniqueKeys = { id: number; githubId: string; };

export type GetUserDTO
    =  __UniqueKeys
    | Omit<__UniqueKeys, "id">
    | Omit<__UniqueKeys, "githubId">;