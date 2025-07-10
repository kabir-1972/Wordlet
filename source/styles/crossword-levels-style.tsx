import { StyleSheet } from "react-native";

const xpBarheight = 20;

export const styles = StyleSheet.create({
xpBar:{
        flexDirection: 'row',
        alignItems: 'center'
    },

    xpBarContainer:{
        width: 80,
        height: xpBarheight,
        borderWidth: 1,
        borderRadius: 4,
        marginLeft: -10,
        position: 'relative'
    },

    xpBarFill:{
        height: xpBarheight-2,
        backgroundColor: '#53c18e',
        borderRadius: 4,
    },
    
    xpBarFloat:{
        width: 78,
        backgroundColor: '#ffffff80',
        height: xpBarheight-10,
        borderRadius: 2,
        position: 'absolute',
    },

    verticalBar:{
        backgroundColor: 'black',
        width: 1,
        height: '120%',
        marginHorizontal: 15,
    },

    levelContainer: {
        paddingVertical: 10,
        flexDirection: 'row',
        marginHorizontal: 5,
        alignItems: 'center'
    },

    levelHeaderParagraph:{
        backgroundColor: 'rgba(245, 245, 200, 0.6)',
        marginHorizontal: 20,
        borderWidth: 1,
        borderRadius: 5,
        padding: 3

    }

})