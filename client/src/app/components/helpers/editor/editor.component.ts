import {Component, OnDestroy, AfterViewInit, EventEmitter, Input, Output, OnInit, OnChanges} from '@angular/core';
import {isNullOrUndefined} from 'util';
import 'tinymce';

declare const tinymce: any;

@Component({
  selector: 'app-text-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  didSetValue = false;
  editor;


  @Input() elementId: string;
  @Input() value: any = '';
  @Output() EditorKeyup: EventEmitter<any> = new EventEmitter<any>();

  baseURL = '/';

  constructor() {
  }


  ngOnInit() {
  }


  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['link', 'paste', 'table', 'lists', 'image'],
      skin_url: this.baseURL + 'assets/skins/lightgray',
      height: '80vh',
      setup: editor => {
        this.editor = editor;
        editor.on('keyup', () => {
          const content = editor.getContent();
          this.EditorKeyup.emit(content);
        });
      },
    });
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

  ngOnChanges() {
    setTimeout(() => {
      if (!isNullOrUndefined(this.editor) && this.value !== '' && !this.didSetValue) {
        console.log(this.value);
        this.didSetValue = true;
        this.editor.setContent(this.value);
      }
    }, 2000);

  }

}

