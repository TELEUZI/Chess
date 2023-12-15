import BaseComponent from '@client/app/components/base-component';

export const p = (className: string, content: string): BaseComponent<'p'> =>
  new BaseComponent({ tag: 'p', className, content });
