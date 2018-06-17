import React, { Component } from 'react';
import Calendar from 'tui-calendar';
import logo from './logo.svg';
// import { Grid, DropdownButton, MenuItem } from 'react-bootstrap';
import THEME_DOORAY from './theme/dooray.js';
import './js/data/calendars.js';
import moment from 'moment';
import $ from 'jquery';
import r from 'rethinkdb';
import { Button, Modal } from '@material-ui/core';
import NewScheduleModal from './NewScheduleModal';

let Calendars = require('./js/data/calendars.js');


let useCreationPopup = true;
let useDetailPopup = true;
let guideElement, datePicker, selectedCalendar;
let cal;

export default class TuiCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: '',
      data: [],
      openModal: false
    };
  }
  componentDidMount() {
    setTimeout(() => {
      Calendar.setTimezoneOffsetCallback(function(timestamp) {
          return new Date(timestamp).getTimezoneOffset();
      });
      cal = new Calendar('#calendar', {
        defaultView: 'month',
        useCreationPopup: false,
        useDetailPopup: true,
        calendars: Calendars.CalendarList,
        theme: THEME_DOORAY,
        template: {
          allday: function(schedule) {
              return getTimeTemplate(schedule, true);
          },
          time: function(schedule) {
              return getTimeTemplate(schedule, false);
          }
        }
      });
      // EVENTS
      cal.on({
          'clickSchedule': function(e) {
              console.log('clickSchedule', e);
              console.log(e);
          },
          beforeCreateSchedule: (e) => {
              console.log('beforeCreateSchedule', e);

            //   let schedule =   {
            //     calendarId: e.calendarId,
            //     bgColor: Calendars.CalendarList[e.calendarId].bgColor,
            //     dragBgColor: Calendars.CalendarList[e.calendarId].dragBgColor,
            //     title: e.title,
            //     category: e.catagory ? e.catagory : 'time',
            //     dueDateClass: e.dueDateClass ? e.dueDateClass : '',
            //     state: e.state,
            //     start: moment(e.start.getTime()).format('LLLL'),
            //     end: moment(e.end.getTime()).format('LLLL'),
            //     raw: e.raw
            //   }
            //   r.table('schedules').insert(schedule).run(connection, (err, res) => {
            //     if (err) throw err;
            //     console.log("added schedule::", res);
            //   });
          },
          'beforeUpdateSchedule': function(e) {
              console.log('beforeUpdateSchedule', e);
              let updatedSchedule =   {
                id: e.schedule.id,
                calendarId: e.schedule.calendarId,
                bgColor: e.calendar ? e.calendar.bgColor : e.schedule.bgColor,
                dragBgColor: e.calendar ? e.calendar.dragBgColor :  e.schedule.dragBgColor,
                title: e.schedule.title,
                category: e.schedule.catagory ? e.schedule.catagory : 'time',
                dueDateClass: e.schedule.dueDateClass ? e.schedule.dueDateClass : '',
                state: e.schedule.state ? e.schedule.state : '',
                start: moment(e.start.getTime()).format('LLLL'),
                end: moment(e.end.getTime()).format('LLLL'),
                raw: {
                  class: e.schedule.raw.class,
                  location: e.schedule.raw.location
                }
              }
              r.table('schedules').get(e.schedule.id).update(updatedSchedule).run(connection, (err, res) => {
                if (err) throw err;
                console.log(res);
              });
              // e.schedule.start = e.start;
              // e.schedule.end = e.end;
              // cal.updateSchedule(e.schedule.id, e.schedule.calendarId, e.schedule);
          },
          'beforeDeleteSchedule': function(e) {
              console.log('beforeDeleteSchedule', e);
              cal.deleteSchedule(e.schedule.id, e.schedule.calendarId);
          }
      });

      connectDbPromise.then((val) => {
        connection = val;
        this.setState({
          tcpConnection: val
        });
        checkCreateTable(this.state.tcpConnection, 'schedules');
        connectTableChanges('schedules', this);
      });

      let date = moment(cal.getDate().getTime());
      let month = date.format('MMMM').charAt(0).toUpperCase() + date.format('MMMM').slice(1);
      let year = date.format('YYYY');
      this.setState({
        currentMonth: month + " " + year
      })

    },500);
  }
  nextMonth = () => {
    cal.next();
    let date = moment(cal.getDate().getTime()).format('MMMM');
    let year = moment(cal.getDate().getTime()).format('YYYY');
    this.setState({
      currentMonth: date.charAt(0).toUpperCase() + date.slice(1) + " " + year
    })
  }
  prevMonth = () => {
    cal.prev();
    let date = moment(cal.getDate().getTime()).format('MMMM');
    let year = moment(cal.getDate().getTime()).format('YYYY');
    this.setState({
      currentMonth: date.charAt(0).toUpperCase() + date.slice(1) + " " + year
    })
  }
  renderDateRange = () => {
    return (
      <div>
        {cal ? moment(cal.getDateRangeStart().getTime()).format('YYYY.MM.DD') + " - "
        + moment(cal.getDateRangeEnd().getTime()).format('YYYY.MM.DD') : null}
      </div>
    );
  }
  renderCurrentMonth = (month) => {
    return (
      <div>&nbsp;{month}</div>
    );
  }
  viewingCalendars = () => {
    cal.toggleSchedules("2", true, false);
  }
  openNewScheduleModal = () => {
    if (this.state.openModal === true) {
        this.setState({openModal: false});
        console.log(this.state.openModal);
    } else {
        this.setState({openModal: true});
        console.log(this.state.openModal);
    }
  }
  render() {
    return (
      <div>
        <NewScheduleModal open={this.state.openModal} closeModal={() => this.setState({openModal: false})} />
        <div id="lnb">
            <div className="lnb-new-schedule">
                <Button id="btn-new-schedule" onClick={(e) => this.openNewScheduleModal()} variant="contained" color="primary" className="lnb-new-schedule-btn" data-toggle="modal">
                    New Schedule
                </Button>
            </div>
            <div id="lnb-calendars" className="lnb-calendars">
                <div>
                    <div className="lnb-calendars-item">
                        <label>
                            <input onChange={(e) => onChangeCalendars(e)} className="tui-full-calendar-checkbox-square" type="checkbox" value="all" defaultChecked />
                            <span></span>
                            <strong>View all</strong>
                        </label>
                    </div>
                </div>
                <div id="calendarList" className="lnb-calendars-d1">
                </div>
            </div>
            <div className="lnb-footer">
                IconCS
            </div>
        </div>
        <div id="right">
            <div id="menu">
            {/* <DropdownButton style={{padding: '6px 15px'}} title="View" id="dropdownMenu-calendarType" className="btn btn-default btn-sm dropdown-toggle">
              <h5 className="text-center"><i id="calendarTypeIcon" className="calendar-icon ic_view_month" style={{marginRight: "4px"}}></i>
              <span id="calendarTypeName" style={{color: '#000'}}>Month</span>&nbsp;</h5>
              <MenuItem onClick={(e) => onClickMenu(e, this.state.data)} eventKey="" className="dropdown-menu-title" role="menuitem" data-action="toggle-daily">
                  <i className="calendar-icon ic_view_day"></i>Daily
              </MenuItem>
              <MenuItem onClick={(e) => onClickMenu(e, this.state.data)} eventKey="" className="dropdown-menu-title" role="menuitem" data-action="toggle-weekly">
                  <i className="calendar-icon ic_view_week"></i>Weekly
              </MenuItem>
              <MenuItem onClick={(e) => onClickMenu(e, this.state.data)} eventKey="" className="dropdown-menu-title" role="menuitem" data-action="toggle-monthly">
                  <i className="calendar-icon ic_view_month"></i>Month
              </MenuItem>
              <MenuItem onClick={(e) => onClickMenu(e, this.state.data)} eventKey="" className="dropdown-menu-title" role="menuitem" data-action="toggle-weeks2">
                  <i className="calendar-icon ic_view_week"></i>2 weeks
              </MenuItem>
              <MenuItem onClick={(e) => onClickMenu(e, this.state.data)} eventKey="" className="dropdown-menu-title" role="menuitem" data-action="toggle-weeks3">
                  <i className="calendar-icon ic_view_week"></i>3 weeks
              </MenuItem>
              <hr />
              <MenuItem onClick={(e) => onClickMenu(e, this.state.data)} eventKey="" role="menuitem" data-action="toggle-workweek">
                  <input type="checkbox" className="tui-full-calendar-checkbox-square" value="toggle-workweek" defaultChecked />
                  <span className="checkbox-title"></span>Show weekends
              </MenuItem>
              <MenuItem onClick={(e) => onClickMenu(e, this.state.data)} eventKey="" role="menuitem" data-action="toggle-start-day-1">
                  <input type="checkbox" className="tui-full-calendar-checkbox-square" value="toggle-start-day-1" />
                  <span className="checkbox-title"></span>Start Week on Monday
              </MenuItem>
              <MenuItem onClick={(e) => onClickMenu(e, this.state.data)} eventKey="" role="menuitem" data-action="toggle-narrow-weekend">
                  <input type="checkbox" className="tui-full-calendar-checkbox-square" value="toggle-narrow-weekend" />
                  <span className="checkbox-title"></span>Narrower than weekdays
              </MenuItem>
            </DropdownButton> */}
              {/*  <span className="dropdown">
                    <button id="dropdownMenu-calendarType" className="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="true">
                        <i id="calendarTypeIcon" className="calendar-icon ic_view_month" style={{marginRight: "4px"}}></i>
                        <span id="calendarTypeName">Dropdown</span>&nbsp;
                        <i className="calendar-icon tui-full-calendar-dropdown-arrow"></i>
                    </button>
                    <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu-calendarType">
                        <li role="presentation">
                            <a className="dropdown-menu-title" role="menuitem" data-action="toggle-daily">
                                <i className="calendar-icon ic_view_day"></i>Daily
                            </a>
                        </li>
                        <li role="presentation">
                            <a className="dropdown-menu-title" role="menuitem" data-action="toggle-weekly">
                                <i className="calendar-icon ic_view_week"></i>Weekly
                            </a>
                        </li>
                        <li role="presentation">
                            <a className="dropdown-menu-title" role="menuitem" data-action="toggle-monthly">
                                <i className="calendar-icon ic_view_month"></i>Month
                            </a>
                        </li>
                        <li role="presentation">
                            <a className="dropdown-menu-title" role="menuitem" data-action="toggle-weeks2">
                                <i className="calendar-icon ic_view_week"></i>2 weeks
                            </a>
                        </li>
                        <li role="presentation">
                            <a className="dropdown-menu-title" role="menuitem" data-action="toggle-weeks3">
                                <i className="calendar-icon ic_view_week"></i>3 weeks
                            </a>
                        </li>
                        <li role="presentation" className="dropdown-divider"></li>
                        <li role="presentation">
                            <a role="menuitem" data-action="toggle-workweek">
                                <input type="checkbox" className="tui-full-calendar-checkbox-square" value="toggle-workweek" defaultChecked />
                                <span className="checkbox-title"></span>Show weekends
                            </a>
                        </li>
                        <li role="presentation">
                            <a role="menuitem" data-action="toggle-start-day-1">
                                <input type="checkbox" className="tui-full-calendar-checkbox-square" value="toggle-start-day-1" />
                                <span className="checkbox-title"></span>Start Week on Monday
                            </a>
                        </li>
                        <li role="presentation">
                            <a role="menuitem" data-action="toggle-narrow-weekend">
                                <input type="checkbox" className="tui-full-calendar-checkbox-square" value="toggle-narrow-weekend" />
                                <span className="checkbox-title"></span>Narrower than weekdays
                            </a>
                        </li>
                    </ul>
                </span>  */}
                <span id="menu-navi" className="pull-left">
                    <button type="button" className="btn btn-default btn-sm move-today" data-action="move-today" onClick={() => cal.today()}>Today</button>
                    <button type="button" className="btn btn-default btn-sm move-day" data-action="move-prev" onClick={() => this.prevMonth()}>
                        <i className="calendar-icon ic-arrow-line-left" data-action="move-prev"></i>
                    </button>
                    <button type="button" className="btn btn-default btn-sm move-day" data-action="move-next" onClick={() => this.nextMonth()}>
                        <i className="calendar-icon ic-arrow-line-right" data-action="move-next"></i>
                    </button>
                </span>
                    <h2 className="text-center currentMonth">{this.renderCurrentMonth(this.state.currentMonth)}</h2>
                <span id="renderRange" className="render-range pull-right">{cal ? this.renderDateRange() : null}</span>
            </div>
            <div id="calendar"></div>
        </div>
      </div>
    );
  }
}

setTimeout(() => {
  (function() {
  var calendarList = document.getElementById('calendarList');
  var html = [];
  Calendars.CalendarList.forEach(function(calendar) {
      html.push('<div class="lnb-calendars-item"><label>' +
          '<input type="checkbox" class="tui-full-calendar-checkbox-round" value="' + calendar.id + '" checked>' +
          '<span style="border-color: ' + calendar.borderColor + '; background-color: ' + calendar.borderColor + ';"></span>' +
          '<span>' + calendar.name + '</span>' +
          '</label></div>'
      );
  });
  calendarList.innerHTML = html.join('\n');
  })();
  $('.lnb-calendars-item input').click((e) => {
    onChangeCalendars(e);
  })
},1000)





let connection = null;
let dbConfig = {
  database: 'calendar',
  // host: '192.168.5.235',
  // host: '192.168.5.235',
  // NOTE: in the world db
  host: '18.219.37.66',
  // host: 'localhost',
  port: 28015
}

// TODO: connect to db from this file and kill connection when leaving
const connectToDb = () => {
  return new Promise((resolve, reject) => {
    r.connect({ db: dbConfig.database, host: dbConfig.host, port: dbConfig.port }, (err, conn) => {
      if(err) throw err && reject(err);
      resolve(conn);
    });
  })
}

const connectTableChanges = (table, dbComponent) => {
  let conn = dbComponent.state.tcpConnection;
  r.table(table).changes({includeInitial: true, includeStates: true, includeTypes: true}).run(conn, (err, cursor) => {
    if (err) throw err;
    cursor.each((err, row) => {
      if (err) throw err;
      console.log(row);
      if (row.type === 'initial') {
        dbComponent.state.data.push(row.new_val);
        // TODO: setting up for pushing in rest api for modile site..
        // $.ajax({
        //   type: "POST",
        //   url: "http://localhost:5000/schedules",
        //   data: row.new_val,
        //   success: () => { console.log("posted::"); },
        //   dataType: ""
        // });
        // TODO:
      } else if (row.state === 'ready') {
        dbComponent.setState({
          data: dbComponent.state.data
        });
        cal.createSchedules(dbComponent.state.data);
      }
      if (row.type === 'remove') {
        cal.deleteSchedule(row.old_val.id, row.old_val.calendarId);
      }
      if (row.type === 'add') {
        dbComponent.state.data.push(row.new_val);
        dbComponent.setState({
          data: dbComponent.state.data
        });
        cal.clear();
        cal.createSchedules(dbComponent.state.data);
      }
      if (row.type === 'change') {
        console.log("logging in change");
        let arr = dbComponent.state.data.map((d) => {
          if (d.id === row.new_val.id) {
            d = row.new_val;
          }
          console.log(d);
          return d;
        });
        dbComponent.setState({
          data: arr
        }, () => {
          cal.clear();
          cal.createSchedules(dbComponent.state.data);
        });
      }
    });
  });
}

const checkCreateTable = (conn, table) => {
  r.db(dbConfig.database).tableList().run(conn, (err, res) => {
    if (err) throw err;
    if (res.includes(table) == false) {
      r.tableCreate(table).run(conn, (err,res) => {
        if (err) throw err;
        console.log("Table didnt exist so created it::", res);
      });
    } else {
      console.log("Table exists::");
    }
    // document.getElementById('loadingspinner').classList.add('hidden');
  });
}

const connectDbPromise = connectToDb();




// TODO: work on moving these functions to thier own file
function getTimeTemplate(schedule, isAllDay) {
    var html = [];

    if (!isAllDay) {
        html.push('<strong>' + moment(schedule.start.getTime()).format('HH:mm') + '</strong> ');
    }
    if (schedule.isPrivate) {
        html.push('<i class="fa fa-lock"></i>');
        html.push(' Private');
    } else {
        if (schedule.isReadOnly) {
            html.push('<i class="fa fa-ban"></i>');
        } else if (schedule.recurrenceRule) {
            html.push('<i class="fa fa-repeat"></i>');
        } else if (schedule.attendees.length) {
            html.push('<i class="fa fa-group"></i>');
        } else if (schedule.location) {
            html.push('<i class="fa fa-map-marker"></i>');
        }
        html.push(' ' + schedule.title);
    }

    return html.join('');
}

function onChangeCalendars(e) {
    var calendarId = e.target.value;
    var checked = e.target.checked;
    var viewAll = document.querySelector('.lnb-calendars-item input');
    var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));
    var allCheckedCalendars = true;

    if (calendarId === 'all') {
        allCheckedCalendars = checked;

        calendarElements.forEach(function (input) {
            var span = input.parentNode;
            input.checked = checked;
            span.style.backgroundColor = checked ? span.style.borderColor : 'transparent';
        });

        Calendars.CalendarList.forEach(function (calendar) {
            calendar.checked = checked;
        });
    } else {
        findCalendar(calendarId).checked = checked;

        allCheckedCalendars = calendarElements.every(function (input) {
            return input.checked;
        });

        if (allCheckedCalendars) {
            viewAll.checked = true;
        } else {
            viewAll.checked = false;
        }
    }

    refreshScheduleVisibility();
}

function refreshScheduleVisibility() {
    var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));

    Calendars.CalendarList.forEach(function (calendar) {
        cal.toggleSchedules(calendar.id, !calendar.checked, false);
    });

    cal.render();

    calendarElements.forEach(function (input) {
        var span = input.nextElementSibling;
        span.style.backgroundColor = input.checked ? span.style.borderColor : 'transparent';
    });
}

function setDropdownCalendarType() {
    var calendarTypeName = document.getElementById('calendarTypeName');
    var calendarTypeIcon = document.getElementById('calendarTypeIcon');
    var options = cal.getOptions();
    var type = cal.getViewName();
    var iconClassName;

    if (type === 'day') {
        type = 'Daily';
        iconClassName = 'calendar-icon ic_view_day';
    } else if (type === 'week') {
        type = 'Weekly';
        iconClassName = 'calendar-icon ic_view_week';
    } else if (options.month.visibleWeeksCount === 2) {
        type = '2 weeks';
        iconClassName = 'calendar-icon ic_view_week';
    } else if (options.month.visibleWeeksCount === 3) {
        type = '3 weeks';
        iconClassName = 'calendar-icon ic_view_week';
    } else {
        type = 'Monthly';
        iconClassName = 'calendar-icon ic_view_month';
    }

    calendarTypeName.innerHTML = type;
    calendarTypeIcon.className = iconClassName;
}

function findCalendar(id) {
    var found;
    Calendars.CalendarList.forEach(function (calendar) {
        if (calendar.id === id) {
            found = calendar;
        }
    });
    return found;
}

function createNewSchedule(event) {
    var start = event.start ? new Date(event.start.getTime()) : new Date();
    var end = event.end ? new Date(event.end.getTime()) : moment().add(1, 'hours').toDate();

    if (useCreationPopup) {
        cal.openCreationPopup({
            start: start,
            end: end
        });
    }
}

function setSchedules(schedules) {
    cal.clear();
    generateSchedule(cal.getViewName(), cal.getDateRangeStart(), cal.getDateRangeEnd());
    cal.createSchedules(schedules);
    refreshScheduleVisibility();
}

function generateSchedule(viewName, renderStart, renderEnd) {
    let ScheduleList = [];
    Calendars.CalendarList.forEach(function (calendar) {
        var i = 0, length = 10;
        if (viewName === 'month') {
            length = 15;
        } else if (viewName === 'day') {
            length = 4;
        }
        // for (; i < length; i += 1) {
        //     generateRandomSchedule(calendar, renderStart, renderEnd);
        // }
    });
}

function onClickMenu(e, schedules) {
    var target = $(e.target).closest('a[role="menuitem"]')[0];
    var action = getDataAction(target);
    var options = cal.getOptions();
    var viewName = '';

    console.log(target);
    console.log(action);
    switch (action) {
        case 'toggle-daily':
            viewName = 'day';
            break;
        case 'toggle-weekly':
            viewName = 'week';
            break;
        case 'toggle-monthly':
            options.month.visibleWeeksCount = 0;
            viewName = 'month';
            break;
        case 'toggle-weeks2':
            options.month.visibleWeeksCount = 2;
            viewName = 'month';
            break;
        case 'toggle-weeks3':
            options.month.visibleWeeksCount = 3;
            viewName = 'month';
            break;
        case 'toggle-narrow-weekend':
            options.month.narrowWeekend = !options.month.narrowWeekend;
            options.week.narrowWeekend = !options.week.narrowWeekend;
            viewName = cal.getViewName();

            target.querySelector('input').checked = options.month.narrowWeekend;
            break;
        case 'toggle-start-day-1':
            options.month.startDayOfWeek = options.month.startDayOfWeek ? 0 : 1;
            options.week.startDayOfWeek = options.week.startDayOfWeek ? 0 : 1;
            viewName = cal.getViewName();

            target.querySelector('input').checked = options.month.startDayOfWeek;
            break;
        case 'toggle-workweek':
            options.month.workweek = !options.month.workweek;
            options.week.workweek = !options.week.workweek;
            viewName = cal.getViewName();

            target.querySelector('input').checked = !options.month.workweek;
            break;
        default:
            break;
    }

    cal.setOptions(options, true);
    cal.changeView(viewName, true);

    setDropdownCalendarType();
    setRenderRangeText();
    setSchedules(schedules);
}

function getDataAction(target) {
    return target.dataset ? target.dataset.action : target.getAttribute('data-action');
}

function setRenderRangeText() {
    var renderRange = document.getElementById('renderRange');
    var options = cal.getOptions();
    var viewName = cal.getViewName();
    var html = [];
    if (viewName === 'day') {
        html.push(moment(cal.getDate().getTime()).format('YYYY.MM.DD'));
    } else if (viewName === 'month' &&
        (!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)) {
        html.push(moment(cal.getDate().getTime()).format('YYYY.MM'));
    } else {
        html.push(moment(cal.getDateRangeStart().getTime()).format('YYYY.MM.DD'));
        html.push(' ~ ');
        html.push(moment(cal.getDateRangeEnd().getTime()).format(' MM.DD'));
    }
    renderRange.innerHTML = html.join('');
}
