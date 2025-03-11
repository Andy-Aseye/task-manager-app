const Sidebar = () => {
  return (
    <div
      className="sidebar"
      aria-label="Application sidebar"
      role="complementary" // Add this role
    >
      <div className="sidebar_container_inner">
        <img className="logo_img" src="/todo.png" alt="TaskKit" />
        <h1 className="app_name">TaskKit</h1> {/* Change p to h1 */}
      </div>
    </div>
  );
};

export default Sidebar;
