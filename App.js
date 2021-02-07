import React, { useState } from 'react';

import uuid from 'react-native-uuid';

import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  Image,
  FlatList
} from 'react-native';

import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  ScaleAnimation,
} from 'react-native-popup-dialog';

import CheckBox from '@react-native-community/checkbox';



const Item = ({ item, onPress, itemStyle, textStyle }) => (
  <TouchableHighlight onPress={onPress} style={[styles.item, itemStyle]}>
    <Text style={[styles.label, textStyle]}>
      {item.value}
    </Text>
  </TouchableHighlight>
);



const App = () => {

  const [
    taskList, setTaskList
  ] = useState([]);
  const [
    current, setCurrent
  ] = useState(null);
  const [
    showEditDialog, setShowEditDialog
  ] = useState(false);
  const [
    editMode, setEditMode
  ] = useState(false);
  const [
    taskText, setTaskText
   ] = useState('');
  const [
    showChecked, setShowChecked
  ] = useState(true);
  const [
    showErrorDialog, setShowErrorDialog
  ] = useState(false);



  const renderItem = ({ item }) => {
    let selectedId = '';
    if (current !== null) {
      selectedId = current.id;
    }
    const backgroundColor = item.id === selectedId ? '#f5821f' : '#ffac64';
    const textDecorationLine = item.checked ? 'line-through' : 'none';

    return (
      showChecked || !item.checked ?
        <Item
          item={item}
          onPress={() => selectItem(selectedId===item.id ? null : item)}
          itemStyle={{ backgroundColor: backgroundColor }}
          textStyle={{ textDecorationLine: textDecorationLine }}
        />
      : 
        <></>
    );
  };

  const selectItem = (item) => {
    setCurrent(item);
    if (item != null) {
      setTaskText(item.value);
    }
  };


  
  const addItem = () => {
    setEditMode(false);
    setTaskText('');
    setShowEditDialog(true);
  };

  const editItem = () => {
    if (current !== null) {
      setEditMode(true);
      setShowEditDialog(true);
    } 
    else {
      setShowErrorDialog(true);
    }
  };
  
  const checkItem = () => {
    if (current !== null) {
      const clone = taskList.slice();
      let item = clone.find( i => {
        if (i.id === current.id) {
          return true;
        }
      });
      item.checked = !item.checked;
      setTaskList(clone);
    } 
    else {
      setShowErrorDialog(true);
    }
  };

  const deleteItem = () => {
    if (current !== null) {
      const clone = taskList.slice();
      let index = clone.findIndex( item => {
        if (item.id === current.id) {
          return true;
        }
      });
      clone.splice(index,1);
      setTaskList(clone);
      setCurrent(null);
    } 
    else {
      setShowErrorDialog(true);
    }
  };



  const undoChanges = () => {
    setTaskText(editMode ? current.value : '' );
    setShowEditDialog(false);
  };

  const saveOrUpdate = () => {
    const clone = taskList.slice();
    if (editMode) {
      let index = clone.findIndex( item => {
        if (item.id === current.id) {
          return true;
        }
      });
      clone[index].value = taskText;
      setCurrent(clone[index]);
    }
    else {
      var id = uuid.v1();
      var newItem = {
        id: id,
        value: taskText,
        checked: false
      };
      clone.push(newItem);
    }
    setTaskList(clone);
    setShowEditDialog(false);
  };



  return (
    <>
      <StatusBar />
      <View style={styles.container}>

        {/* Title */}
        <Text style={styles.title}>
          ToDo List
        </Text>

        {/* Tasks listbox */}
        <FlatList
          data={taskList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={current}
          style={styles.listbox}
          accessibilityRole='scrollbar'
        />

        {/* Checked tasks filter */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <CheckBox
            disabled={false}
            value={showChecked}
            onValueChange={(newValue) => setShowChecked(newValue)}
          />
          <Text 
            style={styles.label}
            onPress={() => setShowChecked(!showChecked)}
          >
            Display checked tasks
          </Text>
        </View>

        {/* Action buttons */}
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 70, minWidth: '100%' }}>
          <TouchableHighlight
            style={styles.imageButtonStyle}
            onPress={() => addItem()}
          >
            <Image
              source={require('./img/add.png')}
              style={styles.imageIcon}
            />
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.imageButtonStyle}
            onPress={() => editItem()}
          >
            <Image
              source={require('./img/edit.png')}
              style={styles.imageIcon}
            />
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.imageButtonStyle}
            onPress={() => checkItem()}
          >
            <Image
              source={require('./img/check.png')}
              style={styles.imageIcon}
            />
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.imageButtonStyle}
            onPress={() => deleteItem()}
          >
            <Image
              source={require('./img/delete.png')}
              style={styles.imageIcon}
            />
          </TouchableHighlight>
        </View>



        {/* Add or Edit dialog */}
        <Dialog
          onDismiss={() => { undoChanges(); }}
          width={0.9}
          visible={showEditDialog}
          rounded
          actionsBordered
          dialogAnimation={new ScaleAnimation()}
          dialogTitle={
            <DialogTitle
              title={editMode?'Edit Task':'New Task'}
              style={{
                backgroundColor: '#F7F7F8',
              }}
              hasTitleBar={false}
              align='left'
            />
          }
          footer={
            <DialogFooter>
              <DialogButton
                text='CANCEL'
                bordered
                onPress={() => { undoChanges(); }}
                key='cancel'
              />
              <DialogButton
                text='OK'
                bordered
                onPress={() => { saveOrUpdate(); }}
                key='ok'
              />
            </DialogFooter>
          }>
          <DialogContent style={{ backgroundColor: '#F7F7F8' }}>
            <Text>
              Task text
            </Text>
            <TextInput 
              placeholder='Put the task text here' 
              value={taskText}
              onChangeText={(newValue) => setTaskText(newValue)}
            />
          </DialogContent>
        </Dialog>



        {/* Error dialog */}
        <Dialog
          onDismiss={() => { }}
          width={0.9}
          visible={showErrorDialog}
          rounded
          actionsBordered
          dialogAnimation={new ScaleAnimation()}
          dialogTitle={
            <DialogTitle
              title='Warning'
              style={{ backgroundColor: '#F7F7F8' }}
              hasTitleBar={false}
              align='left'
            />
          }
          footer={
            <DialogFooter>
              <DialogButton
                text='OK'
                bordered
                onPress={() => { setShowErrorDialog(false) }}
                key='ok'
              />
            </DialogFooter>
          }>
          <DialogContent style={{ backgroundColor: '#F7F7F8' }}>
            <Text>
              To run this action you need to select a task.
            </Text>
            <></>
          </DialogContent>
        </Dialog>

      </View>
    </>
  );
};
export default App;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
  },
  title: {
    color: '#0069cc',
    fontSize: 24,

    marginBottom: 5,
  },
  imageButtonStyle: {
    padding: 10,
    margin: 10,
    backgroundColor: '#f5821f',
  },
  imageIcon: {
    width: 50,
    height: 50
  },

  listbox: {
    flex: 1,
    marginVertical: 20,
    backgroundColor: '#0069cc', minWidth: '100%',
    padding: 10
  },
  item: {
    padding: 10,
    marginVertical: 10,
    width: '100%',
    textDecorationLine: 'underline',
    fontStyle: 'italic'
  },
  label: {
    fontSize: 16,
  },
});