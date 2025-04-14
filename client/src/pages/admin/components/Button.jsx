import styles from "./Button.module.css"
import { Button } from '@chakra-ui/react'


function Buttons(props) {
    const {color, children, discont, onDiscount} = props; 
    return (
        <Button colorScheme={color} onClick={onDiscount}>
            {children}
        </Button>
    
    )
}

export default Buttons