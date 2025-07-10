import { StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
        wordleRow:{
        marginVertical: 3,
        flexDirection: 'row',
        gap: 3,
        alignSelf: 'center',
    },

    wordleBox:{
        backgroundColor: '#e0d9cc',
        borderColor: '#0c0c0c',
        width: 40,
        height: 40,
        paddingVertical: 7,
        paddingHorizontal: 9,

        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center'
    },

    
    clueContainer:{
        flexDirection: 'row',
        width: '100%',
        alignSelf: 'center',
        marginVertical: 10,

    },

    acrossClueContainer:{
       flex: 1,
       marginHorizontal: 4,
       backgroundColor: '#d2fce6',
       borderRadius: 3   

    },

    cluesText:{
        paddingHorizontal: 4,
        paddingVertical: 6
    },

})