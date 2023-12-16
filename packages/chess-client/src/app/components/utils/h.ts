import BaseComponent from '@client/app/components/base-component';

export const h1 = (className: string, content: string): BaseComponent<'h1'> =>
  new BaseComponent({ tag: 'h1', className, content });

export const h2 = (className: string, content: string): BaseComponent<'h2'> =>
  new BaseComponent({ tag: 'h2', className, content });

export const h3 = (className: string, content: string): BaseComponent<'h3'> =>
  new BaseComponent({ tag: 'h3', className, content });

export const h4 = (className: string, content: string): BaseComponent<'h4'> =>
  new BaseComponent({ tag: 'h4', className, content });
