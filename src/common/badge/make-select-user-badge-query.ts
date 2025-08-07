
export function makeSelectUserBadgeQuery(userAlias: string): string {
    return `jsonb_build_object('nickname', ${userAlias}.nickname, 'avatar', ${userAlias}.avatar)`;
}