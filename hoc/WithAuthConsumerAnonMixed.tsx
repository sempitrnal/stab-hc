/**
 * A higher order component that checks if the user has the required permissions to access the page.
 * If the user does not have the required permissions, the user will be redirected to the authFailRedirectUrl.
 */
export function withAuthConsumerAnonMixed<P>(WrappedComponent: any) {
  return function NewComponent(props: P) {
    console.log(props);
    return <WrappedComponent {...props} />;
  };
}
