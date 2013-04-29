package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.websocket;

import java.util.concurrent.CopyOnWriteArraySet;

import org.eclipse.jetty.websocket.api.UpgradeRequest;
import org.eclipse.jetty.websocket.api.UpgradeResponse;
import org.eclipse.jetty.websocket.server.WebSocketHandler;
import org.eclipse.jetty.websocket.servlet.WebSocketCreator;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

public class LiveSocketHandler extends WebSocketHandler {
	protected LiveSocketCreator socketCreator;
	protected CopyOnWriteArraySet<LiveUpdaterSocket> socketContainer;
	
	public LiveSocketHandler() {
		socketCreator = new LiveSocketCreator();
		socketContainer = new CopyOnWriteArraySet<LiveUpdaterSocket>();
	}
	
	@Override
	public void configure(WebSocketServletFactory factory) {
		factory.setCreator(socketCreator);
	}
	
	public class LiveSocketCreator implements WebSocketCreator {
		@Override
		public Object createWebSocket(UpgradeRequest request, UpgradeResponse response) {
			return new LiveUpdaterSocket(LiveSocketHandler.this);
		}
	}
	
	public void addToClientList(LiveUpdaterSocket socket) {
		socketContainer.add(socket);
	}
	
	public void removeFromClientList(LiveUpdaterSocket socket) {
		socketContainer.remove(socket);
	}
	
	public void broadcastMessage(String message) {
		for(LiveUpdaterSocket socket : socketContainer) {
			socket.getSession().getRemote().sendStringByFuture(message);
		}
	}
}
