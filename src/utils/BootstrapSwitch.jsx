import React from 'react'
import { Form } from 'react-bootstrap'

function BootstrapSwitch({ checked, setChecked, disabled }) {
    return (
        <>
            <Form.Check
                type="switch"
                id="custom-switch"
                disabled={disabled}
                checked={checked}
                onChange={() => setChecked(!checked)}
                style={{
                    color: checked ? 'green' : 'red',
                    fontWeight: 'bold',
                    fontSize: '18px',
                }}
            />
        </>
    )
}

export default BootstrapSwitch
