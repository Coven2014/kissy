/*
Copyright 2014, KISSY v5.0.0
MIT Licensed
build time: May 9 14:00
*/
KISSY.add("editor/plugin/ordered-list/cmd",["editor","../list-utils/cmd"],function(h,b){var d=b("editor"),e=b("../list-utils/cmd"),f=e.queryActive,g=new e.ListCommand("ol");return{init:function(c){c.hasCommand("insertOrderedList")||c.addCommand("insertOrderedList",{exec:function(a,b){a.focus();g.exec(a,b)}});var b=d.Utils.getQueryCmd("insertOrderedList");c.hasCommand(b)||c.addCommand(b,{exec:function(a){if((a=a.getSelection())&&!a.isInvalid)return a=a.getStartElement(),a=new d.ElementPath(a),f("ol",
a)}})}}});
