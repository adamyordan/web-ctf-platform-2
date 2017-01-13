import { NgNetsosPage } from './app.po';

describe('ng-netsos App', function() {
  let page: NgNetsosPage;

  beforeEach(() => {
    page = new NgNetsosPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
