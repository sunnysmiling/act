import {formatValueByGapStep} from "../utils/formate-value";
import numberCapital from './number-capital';

class AAmount extends Component {
    render = props => {
        let value = Number(props.value || props.children[0]);
        const {
            precision = 2, 'is-round-up': isRoundUp,
            'has-separator': hasSeparator, separator = ',',
            'is-capital': isCapital = false
        } = props;

        if (isCapital) {
            value = numberCapital(value);
        } else {
            value = this.doPrecision(value, precision, isRoundUp);
            value = this.doFormat(value, hasSeparator, separator);
        }


        return h('text', {class: `a-amount ${props.class}`, ...props}, value);
    };


    doPrecision(value, precision, isRoundUp) {
        const exponentialForm = Number(`${value}e${precision}`)
        const rounded = isRoundUp ? Math.round(exponentialForm) : Math.floor(exponentialForm)
        return Number(`${rounded}e-${precision}`).toFixed(precision)
    }

    doFormat(value, hasSeparator, separator) {
        if (!hasSeparator) {
            return value
        }
        const numberParts = value.split('.')
        let integerValue = numberParts[0]
        const decimalValue = numberParts[1] || ''
        let sign = ''
        if (integerValue.startsWith('-')) {
            integerValue = integerValue.substring(1)
            sign = '-'
        }
        const formattedValue = formatValueByGapStep(3, integerValue, separator, 'right', 0, 1)
        return decimalValue ? `${sign}${formattedValue.value}.${decimalValue}` : `${sign}${formattedValue.value}`
    }
}


define('a-amount', AAmount);
export default AAmount;
export {AAmount};