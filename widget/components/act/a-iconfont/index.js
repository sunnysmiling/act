import icons from './dist/icons.json';

class AIconfont extends Component {
    css() {
        return `@font-face {font-family: "iconfont"; src: url('../../components/act/a-iconfont/fonts/iconfont.ttf') format('truetype');}
        .a-iconfont {font-family: iconfont;}`;
    }

    render = props => {
        const {h} = avm;
        if (props.name || props.children[0].charCodeAt(0) < 57334) {
            props.children = [icons[props.name || props.children[0]]];
        }
        return h('text', {
            class: 'a-iconfont', style: `font-size:${props.size || 16}px;
            color:${props.color || '#999'};
        ${props.style || ''}`
        }, props.children)
    }
}


define('a-iconfont', AIconfont);

export default AIconfont;
export {AIconfont};
