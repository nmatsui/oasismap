FROM debian:trixie AS builder

ARG TF_VERSION="1.14.9"

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        ca-certificates \
        unzip \
        wget && \
    apt-get clean
RUN cd /tmp && \
    /usr/bin/wget https://releases.hashicorp.com/terraform/${TF_VERSION}/terraform_${TF_VERSION}_linux_amd64.zip && \
    /usr/bin/unzip terraform_${TF_VERSION}_linux_amd64.zip


FROM debian:trixie-slim

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        jq && \
    apt-get clean
RUN groupadd -r tfgroup && useradd -r -g tfgroup -m -d /home/tfuser tfuser

COPY --from=builder /tmp/terraform /usr/local/bin/terraform
 
USER tfuser
WORKDIR /home/tfuser
COPY ./entrypoint.sh /home/tfuser/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/terraform"]
CMD ["version"]
