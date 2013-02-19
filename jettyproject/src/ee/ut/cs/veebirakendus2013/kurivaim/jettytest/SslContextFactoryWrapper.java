package ee.ut.cs.veebirakendus2013.kurivaim.jettytest;

import javax.net.ssl.SSLEngine;

import org.eclipse.jetty.util.ssl.SslContextFactory;

public class SslContextFactoryWrapper extends SslContextFactory {
    public SslContextFactoryWrapper() {
        super(false);
    }
	
	@Override
    public void customize(SSLEngine sslEngine) {
        if (getWantClientAuth())
            sslEngine.setWantClientAuth(getWantClientAuth());
        if (getNeedClientAuth())
            sslEngine.setNeedClientAuth(getNeedClientAuth());

        sslEngine.setEnabledCipherSuites(selectCipherSuites(
                sslEngine.getEnabledCipherSuites(),
                sslEngine.getSupportedCipherSuites()));

        sslEngine.setEnabledProtocols(selectProtocols(sslEngine.getEnabledProtocols(),sslEngine.getSupportedProtocols()));
    }
}
