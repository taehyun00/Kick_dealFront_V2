export default function Category(category : string) {
    if (category === 'SOCCER_SHOE') {
        return '축구화';
    } else if (category === 'FOOTBALL_SHOE') {
        return '풋살화';
    } else if (category === 'UNIFORM') {
        return '유니폼';
    } else if (category === 'SOCCER_BALL') {
        return '축구공';
    } else if (category === 'YOUTH') {
        return '유소년';
    } else if (category === 'GITA') {
        return '기타용품';
    } else if (category === 'GOALKEEPER') {
        return 'GK용품';
    } else {
        return '기타';
    }
}