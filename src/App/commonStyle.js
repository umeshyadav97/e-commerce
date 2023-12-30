export const commonStyle = () => ({
    paper: {
        borderRadius: '14px !important',
        backgroundColor: '#FFFFFF',
        paddingTop: '28px',
        paddingBottom: '28px',
        paddingLeft: '26px',
        paddingRight: '26px',
        background: 'inear-gradient(rgba(15, 20, 0, 45), rgba(2, 0, 30, 45)),url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/owl1.jpg)'
    },

    headerPaper: {
        borderRadius: '14px !important',
        backgroundColor: '#FFFFFF',
        paddingTop: '16px',
        paddingBottom: '16px',
        paddingLeft: '28px',
        paddingRight: '28px',
        background: 'inear-gradient(rgba(15, 20, 0, 45), rgba(2, 0, 30, 45)),url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/owl1.jpg)'
    },

    marginTop5: {
        marginTop: '5px'
    },

    marginTop10: {
        marginTop: '10px'
    },

    marginTop15: {
        marginTop: '15px'
    },

    marginTop20: {
        marginTop: '20px'
    },

    marginTop25: {
        marginTop: '25px'
    },
    marginTop30: {
        marginTop: '30px'
    },

    marginLeft25: {
        marginLeft: '25px'
    },
    marginLeft20: {
        marginLeft: '20px'
    },
    marginLeft15: {
        marginLeft: '15px'
    },
    marginLeft10: {
        marginLeft: '10px'
    },
    marginLeft5: {
        marginLeft: '5px'
    },


    marginRight25: {
        marginRight: '25px'
    },
    marginRight20: {
        marginRight: '20px'
    },
    marginRight15: {
        marginRight: '15px'
    },
    marginRight10: {
        marginRight: '10px'
    },
    marginRight5: {
        marginRight: '5px'
    },

    alignItemCenter: {
        alignItems: 'center'
    },

    textAlignCenter: {
        textAlign: 'center'
    },

    textAlignEnd: {
        textAlign: 'end'
    },

    justifyContentCenter: {
        justifyContent: 'center'
    },

    backButtonBox: {
        boxSizing: 'border-box',
        height: '28px',
        width: '28px',
        border: '1.4px solid #DFE7F5',
        borderRadius: '8px',
        backgroundColor: '#F4F7FD',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    roundIconBox: {
        boxSizing: 'border-box',
        height: '44px',
        width: '44px',
        border: '1.4px solid #DFE7F5',
        borderRadius: '50px',
        backgroundColor: '#F4F7FD',
        textAlign: 'center',
        cursor: 'pointer',
        display: 'flex'
    },
    roundIconYellowBox: {
        boxSizing: 'border-box',
        height: '44px',
        width: '44px',
        border: '1.4px solid #FFF0C1',
        borderRadius: '50px',
        backgroundColor: '#FFF0C1',
        textAlign: 'center',
        cursor: 'pointer',
        display: 'flex'
    },
    roundIconRedBox: {
        boxSizing: 'border-box',
        height: '44px',
        width: '44px',
        border: '1.4px solid #F64C4C',
        borderRadius: '50px',
        backgroundColor: '#F64C4C',
        textAlign: 'center',
        cursor: 'pointer',
        display: 'flex'
    },
    roundIconGreenBox: {
        boxSizing: 'border-box',
        height: '44px',
        width: '44px',
        border: '1.4px solid #1DB339',
        borderRadius: '50px',
        backgroundColor: '#1DB339',
        textAlign: 'center',
        cursor: 'pointer',
        display: 'flex'
    },
    roundIconImg: {
        height: '20px',
        width: '20px',
        margin: 'auto'
    },
    backArrowImg: {
        height: '12px',
        width: '7px',
    },
    paperHeading: {
        color: '#242424',
        fontFamily: 'Inter SemiBold',
        fontSize: '18px',
        lineHeight: '28px',
        textTransform: 'Capitalize'
    },
    primaryButton: {
        boxSizing: 'border-box',
        height: '48px',
        minWidth: '112px',
        borderRadius: '8px',
        backgroundColor: '#FC68A2',
        color: '#FFFFFF',
        fontFamily: 'Inter SemiBold',
        fontSize: '16px',
        lineHeight: '22px',
        paddingRight:"20px",
        paddingLeft:"20px",
        "&:hover": {
            backgroundColor: '#F55393',
            boxShadow: '0 0 15px 0 rgba(0,0,0,0.22)'
        }
    },
    transparentButton: {
        boxSizing: 'border-box',
        height: '48px',
        minWidth: '112px',
        border: '1.6px solid #FC68A2',
        borderRadius: '8px',
        color: '#FC68A2',
        fontFamily: 'Inter',
        fontSize: '16px',
        fontWeight: '600',
        letterSpacing: 0,
        lineHeight: '22px'

    },
    labelText: {
        color: '#242424',
        fontFamily: 'Inter',
        fontSize: '14px',
        fontWeight: '600',
        letterSpacing: 0,
        lineHeight: '22px'
    },
    valueText: {
        color: '#242424',
        fontFamily: 'Inter',
        fontSize: '16px',
        letterSpacing: 0,
        lineHeight: '24px'
    },
    tableHead: {
        borderRadius: '8px',
        backgroundColor: '#ECF1F9'
    },
    tblHeadingText: {
        color: '#242424',
        fontFamily: 'Inter SemiBold',
        fontSize: '18px',
        fontWeight: '600',
        letterSpacing: 0,
        lineHeight: '28px'
    },
    tableCellHeadingFirst: {
        borderBottomLeftRadius: '8px',
        borderTopLeftRadius: '8px',
        color: '#242424 !important',
        fontFamily: 'Inter',
        fontSize: '14px',
        fontWeight: 500,
        letterSpacing: 0,
        lineHeight: '22px'
    },
    tableCellHeadingLast: {
        borderBottomRightRadius: '8px',
        borderTopRightRadius: '8px',
        color: '#242424 !important',
        fontFamily: 'Inter',
        fontSize: '14px',
        fontWeight: 500,
        letterSpacing: 0,
        lineHeight: '22px'
    },
    tableCellHeading: {
        color: '#242424 !important',
        fontFamily: 'Inter',
        fontSize: '14px',
        fontWeight: 500,
        letterSpacing: 0,
        lineHeight: '22px'
    },
    tableRowSimpleFirst: {
        borderBottomLeftRadius: '8px',
        borderTopLeftRadius: '8px',
        borderRight: 'none !important',
        border: '1.4px solid #DFE7F5',
        color: '#242424',
        fontFamily: 'Inter',
        fontSize: '16px',
        letterSpacing: 0,
        lineHeight: '24px',
        cursor: 'pointer'
    },
    tableRowSimpleLast: {
        borderBottomRightRadius: '8px',
        borderTopRightRadius: '8px',
        borderLeft: 'none',
        border: '1.4px solid #DFE7F5',
        color: '#242424',
        fontFamily: 'Inter',
        fontSize: '16px',
        letterSpacing: 0,
        lineHeight: '24px',
        cursor: 'pointer'
    },
    tableRowSimple: {
        borderRight: 'none !important',
        borderLeft: 'none',
        border: '1.4px solid #DFE7F5',
        color: '#242424',
        fontFamily: 'Inter Medium',
        fontSize: '16px',
        letterSpacing: 0,
        lineHeight: '24px',
        cursor: 'pointer'
    },
    toggleButtonText: {
        color: '#242424',
        fontFamily: 'Inter',
        fontSize: '18px',
        fontWeight: 600,
        letterSpacing: 0,
        lineHeight: '28px',
        textAlign: 'center',
        background: 'white'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalHeader: {
        borderRadius: '8px 8px 0 0',
        backgroundColor: '#FC68A2',
        padding: '24px 30px',
    },
    modalPaper: {
        borderRadius: '14px !important',
        backgroundColor: '#FFFFFF',
        minHeight: '250px',
        minWidth: '350px'
    },
    moadlHeading: {
        color: '#FFFFFF',
        fontFamily: 'Inter SemiBold',
        fontSize: '18px',
        fontWeight: 600,
        letterSpacing: 0,
        lineHeight: '28px'
    },
    modalContent: {
        padding: '24px 30px',
        maxHeight: '550px',
        overflowY: 'auto'

    },
    popperPaper: {
        boxSizing: 'border-box',
        border: '1px solid #DFE7F5',
        padding: '30px 20px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 6px 14px 0 rgba(149,157,171,0.4)',
        borderRadius: '14px !important',
        display: 'block'
    },
    multiSelectDropDown: {
        boxSizing: 'border-box',
        height: '48px',
        border: '1.6px solid #DFE7F5',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF'
    },
    noResultCell: {
        display: 'grid',
        padding: '30px 6px'
    },
    noResultRow: {
        borderRadius: '12px',
        border: '2px solid #dfe7f5'
    }
});