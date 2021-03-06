# ToDoList

## Introduction

This project is an useful quickstart with react-native technology. 

It consists in a classic **ToDo list** with CRUD operations and the possibilty to check a task
as already completed.

## Features

The application displays the task list inside a FlatList where a completed task will appear
with an overline. The user is allowed to select/deselect an item by clicking above it.

A checkbox allows to **filter** the tasks by hiding or showing the completed ones.

Four action buttons give access to the main operations:

1. **New**: open the Task dialog in new mode
2. **Edit**: open the Task dialog in edit mode on the selected task
3. **Check**: toggle the selected task completation status
4. **Delete**: delete the selected task

The **Task dialog** displays a TextInput to update a task (edit mode) or to create a new one.
Pressing *Ok* the modification will be applied to the task list, *Cancel* will restore the
dialog text to the initial state.

To perform Edit, Check and Delete operations it is required that a task is selected,
otherwise it will be displayed a **Warning dialog**.

## Dependencies

In order to create this app, the following packages has been installed:

1. react-native-popup-dialog
2. @react-native-community/checkbox
3. react-native-uuid