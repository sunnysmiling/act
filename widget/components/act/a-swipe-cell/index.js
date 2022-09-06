class ASwipeCell extends Component {

    ns = 'a-swipe-cell';
    preEvent = () => {
    };

    install() {

        this[this.ns] = {
            slots: {},
            body: []
        }

        this.props.children.forEach(child => {
            if (child.nodeName === 'template') {
                this[this.ns].slots[child.attributes._slot] = child;
            } else {
                console.log(child)
                this[this.ns].body.push(child);
            }
        })

        console.log(this)
    }

    render(props) {
        return (
            <view className={this.ns}>
                {this[this.ns].slots.left && <view class={`${this.ns}__left`}>
                    {this[this.ns].slots.left.children}
                </view>}

                <view class={`${this.ns}__body`} ontouchmove={this.ontouchmove} onclick={this.preEvent}>
                    {this[this.ns].body}
                </view>

                {this[this.ns].slots.right && <view className={`${this.ns}__right`}>
                    {this[this.ns].slots.right.children}
                </view>}
            </view>
        );
    }


    ontouchmove(e) {
        console.log(e)
    }
}


export default ASwipeCell;
export {ASwipeCell};