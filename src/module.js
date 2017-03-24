import config from 'app/core/config';
import appEvents from 'app/core/app_events';

import {PanelCtrl} from  'app/plugins/sdk';

import _ from 'lodash';
import moment from 'moment';


class ButtonPanelCtrl extends PanelCtrl {
  constructor($scope, $injector, $q, $rootScope, $timeout, $http) {
    super($scope, $injector);
    this.datasourceSrv = $injector.get('datasourceSrv');
    this.injector = $injector;
    this.q = $q;
    this.$timeout = $timeout;
    this.$http = $http;

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('render', this.onRender.bind(this));
    this.events.on('panel-initialized', this.onPanelInitalized.bind(this));
    this.events.on('refresh', this.onRefresh.bind(this));
  }

  onInitEditMode() {
    // All influxdb datasources
    this.dbs = [];
    _.forEach(config.datasources, (val, key) => {
      if ("influxdb" == val.type) {
        if(key == config.defaultDatasource) {
          this.dbs.unshift(key);
        }
        else {
          this.dbs.push(key);
        }
      }
    });

    this.addEditorTab('Options', 'public/plugins/natel-influx-admin-panel/editor.html',1);
    this.editorTabIndex = 1;
  }

  writeData() {
    console.log( "WRITE", this.writeDataText );
    this.writing = true;
    this.error = null;
    return this.datasourceSrv.get(this.panel.datasource).then( (ds) => {
      this.$http({
        url: ds.urls[0] + '/write?db=' + ds.database,
        method: 'POST',
        data: this.writeDataText,
        headers: {
          "Content-Type": "plain/text"
        }
      }).then((rsp) => {
        this.writing = false;
        console.log( "OK", rsp );
      }, err => {
        this.writing = false;
        console.log( "ERROR", err );
        this.error = err.data.error + " ["+err.status+"]";
      });
    });
  }

  onButtonClicked() {
    console.log( "CLICK!!!!!" );
  }
}
ButtonPanelCtrl.templateUrl = 'module.html';

export {
  ButtonPanelCtrl as PanelCtrl
};

