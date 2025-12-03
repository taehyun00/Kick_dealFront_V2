export default function Routercategory(category : string) {
    if (category === 'SOCCER_SHOE') {
        return 'soccershoe';
    } else if (category === 'FOOTBALL_SHOE') {
        return 'footballshoe';
    } else if (category === 'UNIFORM') {
        return 'uniform';
    } else if (category === 'SOCCER_BALL') {
        return 'ball';
    } else if (category === 'YOUTH') {
        return 'kids';
    } else if (category === 'GITA') {
        return 'etc';
    } else if (category === 'GOALKEEPER') {
        return 'goalkeeper';
    } else {
        return '기타';
    }
}